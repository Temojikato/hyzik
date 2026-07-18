const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

initializeApp();

const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const requireAdmin = (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  if (request.auth.token.admin !== true) throw new HttpsError('permission-denied', 'Administrator access required.');
};

const itemPath = (itemId) => `items/${clean(itemId, 180)}`;
const quantity = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(9999, Math.floor(parsed))) : 1;
};
const addInventoryEntry = (inventory, reference, amount) => {
  const next = [...(inventory || [])];
  const existing = next.find((entry) => entry.reference?.path === reference.path);
  if (existing) existing.quantity = Math.max(0, Number(existing.quantity || 0)) + amount;
  else next.push({ reference, quantity: amount });
  return next.filter((entry) => Number(entry.quantity || 0) > 0);
};
const removeInventoryEntry = (inventory, reference, amount) => {
  const next = [...(inventory || [])];
  const existing = next.find((entry) => entry.reference?.path === reference.path);
  if (!existing || Number(existing.quantity || 0) < amount) {
    throw new HttpsError('failed-precondition', 'You no longer have enough of that item.');
  }
  existing.quantity = Number(existing.quantity || 0) - amount;
  return next.filter((entry) => Number(entry.quantity || 0) > 0);
};
const activeAudience = async (db, finderId) => {
  const snapshot = await db.collection('users').get();
  return snapshot.docs.filter((entry) => entry.id !== finderId && entry.data().active !== false).map((entry) => entry.id);
};

exports.adminCreateUser = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  requireAdmin(request);
  const email = clean(request.data?.email, 254).toLowerCase();
  const displayName = clean(request.data?.displayName, 80);
  const password = typeof request.data?.password === 'string' ? request.data.password : '';
  if (!email || !displayName || password.length < 6) {
    throw new HttpsError('invalid-argument', 'Name, valid email, and a password of at least 6 characters are required.');
  }
  let created;
  try {
    created = await getAuth().createUser({ email, displayName, password });
    await getFirestore().collection('users').doc(created.uid).set({
      email, displayName, active: false, conditions: [], inventory: [], unlockedCyphers: [], unlockedRecipes: [],
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    if (created?.uid) await getAuth().deleteUser(created.uid).catch(() => undefined);
    console.error('Admin user creation failed', error);
    throw new HttpsError(error?.code === 'auth/email-already-exists' ? 'already-exists' : 'internal', error?.message || 'Could not create user.');
  }
  return { uid: created.uid, email, displayName };
});

exports.adminDeleteUser = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  requireAdmin(request);
  const uid = clean(request.data?.uid, 128);
  if (!uid) throw new HttpsError('invalid-argument', 'A user ID is required.');
  if (uid === request.auth.uid) throw new HttpsError('failed-precondition', 'You cannot delete your own administrator account.');
  const db = getFirestore();
  try {
    await getAuth().deleteUser(uid);
    await db.recursiveDelete(db.collection('users').doc(uid));
  } catch (error) {
    console.error('Admin user deletion failed', error);
    throw new HttpsError('internal', error?.message || 'Could not delete user.');
  }
  return { uid };
});

exports.getActiveParty = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const snapshot = await getFirestore().collection('users').get();
  return {
    players: snapshot.docs
      .filter((entry) => entry.id !== request.auth.uid && entry.data().active !== false)
      .map((entry) => ({
        id: entry.id,
        displayName: clean(entry.data().displayName, 80) || clean(entry.data().email, 120) || 'Unnamed player',
        reyvateilName: clean(entry.data().reyvateilName || entry.data().reyvateilId, 80),
      })),
  };
});

exports.shareGrantWithParty = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const deliveryId = clean(request.data?.deliveryId, 128);
  if (!deliveryId) throw new HttpsError('invalid-argument', 'A discovery ID is required.');
  const db = getFirestore();
  const audienceIds = await activeAudience(db, request.auth.uid);
  const finderSnapshot = await db.collection('users').doc(request.auth.uid).get();
  const finderName = finderSnapshot.exists ? clean(finderSnapshot.data().displayName, 80) || 'A party member' : 'A party member';
  const deliveryRef = db.collection('grantDeliveries').doc(deliveryId);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(deliveryRef);
    if (!snapshot.exists) throw new HttpsError('not-found', 'This discovery is no longer available.');
    const delivery = snapshot.data();
    if (delivery.recipientId !== request.auth.uid) throw new HttpsError('permission-denied', 'Only the finder can reveal this discovery.');
    if (delivery.kind !== 'item' || delivery.status !== 'waiting') throw new HttpsError('failed-precondition', 'This discovery cannot be shared.');
    transaction.update(deliveryRef, { status: 'shared', audienceIds, senderName: finderName, sharedAt: FieldValue.serverTimestamp() });
  });
  return { audienceCount: audienceIds.length };
});

exports.publishLoot = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const requested = Array.isArray(request.data?.items) ? request.data.items.slice(0, 20) : [];
  const items = requested.map((entry) => ({
    itemId: clean(entry?.itemId, 180),
    amount: quantity(entry?.amount),
  })).filter((entry) => entry.itemId && entry.itemId.toLowerCase() !== 'nothing');
  if (!items.length) return { count: 0 };
  const db = getFirestore();
  const finderSnapshot = await db.collection('users').doc(request.auth.uid).get();
  if (!finderSnapshot.exists) throw new HttpsError('not-found', 'Your player profile is missing.');
  const itemSnapshots = await Promise.all(items.map((entry) => db.doc(itemPath(entry.itemId)).get()));
  const batch = db.batch();
  let count = 0;
  items.forEach((entry, index) => {
    const itemSnapshot = itemSnapshots[index];
    if (!itemSnapshot.exists) return;
    const deliveryRef = db.collection('grantDeliveries').doc();
    batch.set(deliveryRef, {
      groupId: `loot-${Date.now()}-${request.auth.uid}`,
      recipientId: request.auth.uid,
      senderId: request.auth.uid,
      senderName: clean(finderSnapshot.data().displayName, 80) || 'A party member',
      kind: 'item', resourceId: entry.itemId,
      label: clean(itemSnapshot.data().name, 120) || entry.itemId,
      amount: entry.amount, source: 'loot', status: 'waiting', audienceIds: [],
      createdAt: FieldValue.serverTimestamp(),
    });
    count += 1;
  });
  if (count) await batch.commit();
  return { count };
});

exports.createInventoryTransfer = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const itemId = clean(request.data?.itemId, 180);
  const targetUserId = clean(request.data?.targetUserId, 128);
  const amount = quantity(request.data?.amount);
  if (!itemId || !targetUserId || targetUserId === request.auth.uid) throw new HttpsError('invalid-argument', 'Choose another player and a valid item.');
  const db = getFirestore();
  const senderRef = db.collection('users').doc(request.auth.uid);
  const targetRef = db.collection('users').doc(targetUserId);
  const itemRef = db.doc(itemPath(itemId));
  const deliveryRef = db.collection('grantDeliveries').doc();
  await db.runTransaction(async (transaction) => {
    const [senderSnapshot, targetSnapshot, itemSnapshot] = await Promise.all([
      transaction.get(senderRef), transaction.get(targetRef), transaction.get(itemRef),
    ]);
    if (!senderSnapshot.exists || !targetSnapshot.exists || !itemSnapshot.exists) throw new HttpsError('not-found', 'The player or item no longer exists.');
    if (targetSnapshot.data().active === false) throw new HttpsError('failed-precondition', 'That player is currently inactive.');
    const inventory = removeInventoryEntry(senderSnapshot.data().inventory, itemRef, amount);
    transaction.update(senderRef, { inventory });
    transaction.set(deliveryRef, {
      groupId: `transfer-${deliveryRef.id}`,
      recipientId: targetUserId, senderId: request.auth.uid,
      senderName: clean(senderSnapshot.data().displayName, 80) || 'A party member',
      kind: 'item', resourceId: itemId,
      label: clean(itemSnapshot.data().name, 120) || itemId,
      amount, source: 'transfer', status: 'transfer-waiting', audienceIds: [],
      createdAt: FieldValue.serverTimestamp(),
    });
  });
  return { deliveryId: deliveryRef.id };
});

exports.respondToInventoryTransfer = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const deliveryId = clean(request.data?.deliveryId, 128);
  const accept = request.data?.accept === true;
  const db = getFirestore();
  const deliveryRef = db.collection('grantDeliveries').doc(deliveryId);
  await db.runTransaction(async (transaction) => {
    const deliverySnapshot = await transaction.get(deliveryRef);
    if (!deliverySnapshot.exists) throw new HttpsError('not-found', 'This transfer is no longer available.');
    const delivery = deliverySnapshot.data();
    if (delivery.recipientId !== request.auth.uid || delivery.source !== 'transfer' || delivery.status !== 'transfer-waiting') {
      throw new HttpsError('permission-denied', 'This transfer belongs to another player.');
    }
    const ownerId = accept ? request.auth.uid : clean(delivery.senderId, 128);
    const ownerRef = db.collection('users').doc(ownerId);
    const ownerSnapshot = await transaction.get(ownerRef);
    if (!ownerSnapshot.exists) throw new HttpsError('not-found', 'The receiving player no longer exists.');
    const reference = db.doc(itemPath(delivery.resourceId));
    const inventory = addInventoryEntry(ownerSnapshot.data().inventory, reference, quantity(delivery.amount));
    transaction.update(ownerRef, { inventory });
    transaction.delete(deliveryRef);
  });
  return { accepted: accept };
});

exports.claimGrantDelivery = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const deliveryId = clean(request.data?.deliveryId, 128);
  const mode = clean(request.data?.mode, 16);
  const requestedTargetId = clean(request.data?.targetUserId, 128);
  if (!deliveryId) throw new HttpsError('invalid-argument', 'A delivery ID is required.');
  const db = getFirestore();
  const deliveryRef = db.collection('grantDeliveries').doc(deliveryId);

  return db.runTransaction(async (transaction) => {
    const deliverySnapshot = await transaction.get(deliveryRef);
    if (!deliverySnapshot.exists) throw new HttpsError('not-found', 'This discovery has already been claimed.');
    const delivery = deliverySnapshot.data();
    if (delivery.recipientId !== request.auth.uid) throw new HttpsError('permission-denied', 'This discovery belongs to another player.');

    const kind = clean(delivery.kind, 16);
    if (delivery.source === 'transfer') throw new HttpsError('failed-precondition', 'Use the transfer response action.');
    if (kind === 'item' && delivery.status === 'shared' && mode !== 'assign') throw new HttpsError('failed-precondition', 'Choose who receives this shared item.');
    if (kind === 'item' && delivery.status === 'waiting' && mode !== 'take') throw new HttpsError('failed-precondition', 'Take the item or reveal it to the group.');
    const targetUserId = kind === 'item' && mode === 'assign' ? requestedTargetId : request.auth.uid;
    if (!targetUserId) throw new HttpsError('invalid-argument', 'Choose a player to receive the item.');
    const userRef = db.collection('users').doc(targetUserId);
    const userSnapshot = await transaction.get(userRef);
    if (!userSnapshot.exists) throw new HttpsError('not-found', 'The selected player no longer exists.');
    if (mode === 'assign' && userSnapshot.data().active === false) throw new HttpsError('failed-precondition', 'That player is currently inactive.');

    const amount = quantity(delivery.amount);
    if (kind === 'item') {
      const itemRef = db.doc(itemPath(delivery.resourceId));
      const inventory = addInventoryEntry(userSnapshot.data().inventory, itemRef, amount);
      transaction.update(userRef, { inventory });
    } else if (kind === 'condition') {
      const conditions = (userSnapshot.data().conditions || []).map((entry) => typeof entry === 'string' ? { name: entry, amount: 0 } : { ...entry });
      const label = clean(delivery.label, 120);
      const existing = conditions.find((entry) => String(entry.name).toLowerCase() === label.toLowerCase());
      if (existing) existing.amount = Math.max(0, Number(existing.amount || 0)) + amount;
      else conditions.push({ name: label, amount, type: clean(delivery.conditionType, 40), color: clean(delivery.conditionColor, 40) });
      transaction.update(userRef, { conditions });
    } else if (kind === 'cypher') {
      transaction.update(userRef, { unlockedCyphers: FieldValue.arrayUnion(clean(delivery.resourceId, 128)) });
    } else {
      throw new HttpsError('invalid-argument', 'Unknown grant type.');
    }

    transaction.delete(deliveryRef);
    return {
      kind,
      label: clean(delivery.label, 120),
      amount,
      targetUserId,
      targetName: clean(userSnapshot.data().displayName, 80) || 'the selected player',
    };
  });
});
