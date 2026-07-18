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
