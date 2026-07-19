const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const crypto = require('crypto');
const combatCatalog = require('./combatCatalog.json');

initializeApp();

const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const currentCombatCatalog = (registered, reyvateilId) => {
  const bundled = combatCatalog[reyvateilId];
  if (!registered) return bundled;
  if (bundled && Number(registered.catalogVersion || 0) < Number(bundled.catalogVersion || 0)) return bundled;
  return registered;
};
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
  return snapshot.docs.filter((entry) => entry.id !== finderId && entry.data().active !== false && entry.data().mortality?.dead !== true).map((entry) => entry.id);
};

const normalizedMortality = (value = {}) => ({
  permanentDamage: Math.max(0, Math.floor(Number(value.permanentDamage || 0))),
  lostLimbs: Array.isArray(value.lostLimbs) ? value.lostLimbs.map((entry) => clean(String(entry), 80)).filter(Boolean) : [],
  dead: value.dead === true,
  deathCause: clean(value.deathCause, 180),
  updatedAtMs: Number(value.updatedAtMs || 0),
  ...(Number(value.revivedAtMs || 0) > 0 ? { revivedAtMs: Number(value.revivedAtMs) } : {}),
});
const applyMortalityConsequence = (current, consequence, amount = 1, detail = '') => {
  const mortality = normalizedMortality(current);
  const count = Math.max(1, Math.min(20, Math.floor(Number(amount || 1))));
  if (consequence === 'permanent-damage') mortality.permanentDamage += count;
  else if (consequence === 'lost-limb') {
    const label = clean(detail, 80) || 'Unspecified limb';
    for (let index = 0; index < count; index += 1) mortality.lostLimbs.push(count > 1 ? `${label} ${index + 1}` : label);
  } else if (consequence === 'death') {
    mortality.dead = true;
    mortality.deathCause = 'Unprotected attack roll of 21 or higher';
  } else throw new HttpsError('invalid-argument', 'Unknown mortal consequence.');
  if (!mortality.dead && mortality.lostLimbs.length >= 3) {
    mortality.dead = true;
    mortality.deathCause = 'Three lost limbs';
  }
  if (!mortality.dead && mortality.permanentDamage >= 5) {
    mortality.dead = true;
    mortality.deathCause = 'Five permanent injuries';
  }
  mortality.updatedAtMs = Date.now();
  return mortality;
};

const activeEncounterForUser = async (transaction, db, userId) => {
  const campaignSnapshot = await transaction.get(db.collection('campaign').doc('current'));
  const encounterId = clean(campaignSnapshot.data()?.activeEncounterId, 128);
  if (!encounterId) return null;
  const ref = db.collection('encounters').doc(encounterId);
  const snapshot = await transaction.get(ref);
  if (!snapshot.exists || snapshot.data().status !== 'active') return null;
  const participants = (snapshot.data().participants || []).map((entry) => ({ ...entry }));
  const participant = participants.find((entry) => entry.kind === 'player' && entry.sourceId === userId);
  return participant ? { ref, participants, participant, activeSong: snapshot.data().activeSong || null } : null;
};

const deterministicSubset = (ids, count, seed) => {
  return [...ids]
    .map((id) => ({ id, score: crypto.createHash('sha256').update(`${seed}:${id}`).digest('hex') }))
    .sort((a, b) => a.score.localeCompare(b.score))
    .slice(0, count)
    .map((entry) => entry.id);
};

const PLAYER_COMBAT_PROFILE_VERSION = 2;
const roleTechniqueAptitude = {
  vanguard: 'force', bulwark: 'force', striker: 'finesse', skirmisher: 'finesse',
  controller: 'resonance', support: 'focus', channeler: 'resonance', tactician: 'focus',
};
const buildPlayerCombatState = ({ combat, user = {}, uid, reyvateilId, level: requestedLevel }) => {
  const level = Math.max(1, Math.min(20, Math.floor(Number(requestedLevel || user.reyvateilLevel || user.level || 1))));
  const aptitudes = { ...combat.aptitudes };
  const growth = combat.growth || {};
  const growthOrder = Array.isArray(growth.aptitudeGrowthOrder) && growth.aptitudeGrowthOrder.length
    ? growth.aptitudeGrowthOrder
    : ['focus', 'guard', 'resonance', 'tempo', 'force'];
  const increaseCount = (growth.aptitudeIncreaseLevels || []).filter((unlockLevel) => level >= Number(unlockLevel)).length;
  for (let index = 0; index < increaseCount; index += 1) {
    const key = growthOrder[index % growthOrder.length];
    aptitudes[key] = Math.min(Number(growth.aptitudeCap || 7), Number(aptitudes[key] || 0) + 1);
  }
  const techniqueAptitude = combat.techniqueAptitude || roleTechniqueAptitude[combat.role] || 'focus';
  const techniqueCount = Math.min(
    combat.combatAbilities.length,
    5 + (growth.newTechniqueLevels || []).filter((unlockLevel) => level >= Number(unlockLevel)).length,
  );
  const baseGuard = Number(combat.aptitudes.guard || 0);
  const maxHp = Number(combat.derived.maxHp || 1)
    + Math.max(0, level - 1) * Number(growth.hitPointsPerLevel || (3 + baseGuard))
    + Math.max(0, aptitudes.guard - baseGuard) * 4;
  const derived = {
    maxHp,
    defense: 10 + aptitudes.guard + aptitudes.finesse,
    initiative: aptitudes.tempo,
    techniqueAttack: 2 + aptitudes[techniqueAptitude],
    songAttack: 2 + aptitudes.resonance,
    saveDifficulty: 10 + aptitudes.focus,
    movement: 5 + Math.floor(aptitudes.tempo / 2),
  };
  const inheritedCombatAbilityIds = deterministicSubset(
    combat.combatAbilities.map((ability) => ability.id), techniqueCount, `${uid}:${reyvateilId}:combat-v1`,
  );
  const inheritedSocialAbilityIds = Array.isArray(user.combatProfile?.inheritedSocialAbilityIds) && user.combatProfile.inheritedSocialAbilityIds.length
    ? user.combatProfile.inheritedSocialAbilityIds
    : deterministicSubset(combat.socialAbilities.map((ability) => ability.id), 5, `${uid}:${reyvateilId}:social-v1`);
  const oldMaxHp = Number(user.combatStats?.maxHp);
  const oldCurrentHp = Number(user.combatStats?.currentHp);
  const currentHp = Number.isFinite(oldCurrentHp) && oldCurrentHp >= 0
    ? Math.min(maxHp, oldCurrentHp + (Number.isFinite(oldMaxHp) ? Math.max(0, maxHp - oldMaxHp) : 0))
    : maxHp;
  return {
    combatProfile: {
      version: PLAYER_COMBAT_PROFILE_VERSION,
      catalogVersion: Number(combat.catalogVersion || 0),
      specialtyTitle: clean(combat.specialtyTitle, 120),
      role: clean(combat.role, 40),
      level,
      techniqueAptitude,
      aptitudes,
      derived,
      inheritedCombatAbilityIds,
      inheritedSocialAbilityIds,
      assignedAt: user.combatProfile?.assignedAt || FieldValue.serverTimestamp(),
    },
    combatStats: { currentHp, maxHp, armorClass: derived.defense },
  };
};

const freshTurnResources = () => ({
  actionAvailable: true,
  songAvailable: true,
  quickAvailable: false,
  reactionAvailable: true,
  roundUses: {},
  encounterUses: {},
});

const universalCombatAbilities = {
  'universal-strike': { id: 'universal-strike', name: 'Strike', actionType: 'action', reset: 'turn', uses: 1 },
  'universal-brace': { id: 'universal-brace', name: 'Brace', actionType: 'action', reset: 'turn', uses: 1 },
  'universal-sprint': { id: 'universal-sprint', name: 'Sprint', actionType: 'action', reset: 'turn', uses: 1 },
  'universal-withdraw': { id: 'universal-withdraw', name: 'Withdraw', actionType: 'action', reset: 'turn', uses: 1 },
  'universal-assist': { id: 'universal-assist', name: 'Assist', actionType: 'action', reset: 'turn', uses: 1 },
  'universal-shove': { id: 'universal-shove', name: 'Shove', actionType: 'action', reset: 'turn', uses: 1 },
};

const initiativeSequence = (participants) => participants
  .filter((participant) => participant.dead !== true)
  .map((participant, index) => ({ participant, index }))
  .sort((a, b) => Number(b.participant.initiative) - Number(a.participant.initiative) || a.index - b.index)
  .map(({ participant }) => participant.id);

exports.selectReyvateilProfile = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const reyvateilId = clean(request.data?.reyvateilId, 80);
  const imageUrl = clean(request.data?.imageUrl, 2000);
  if (!reyvateilId) throw new HttpsError('invalid-argument', 'Choose a Reyvateil first.');
  const db = getFirestore();
  const reyvateilSnapshot = await db.collection('reyvateils').doc(reyvateilId).get();
  if (!reyvateilSnapshot.exists) throw new HttpsError('not-found', 'That Reyvateil is not registered.');
  const reyvateil = reyvateilSnapshot.data();
  const combat = currentCombatCatalog(reyvateil.combat, reyvateilId);
  if (!combat || !Array.isArray(combat.combatAbilities) || combat.combatAbilities.length < 10 || !Array.isArray(combat.combatSongs) || combat.combatSongs.length < 4 || !Array.isArray(combat.socialAbilities) || combat.socialAbilities.length < 10) {
    throw new HttpsError('failed-precondition', 'That Reyvateil combat profile has not been prepared yet.');
  }
  const userRef = db.collection('users').doc(request.auth.uid);
  if (Number(reyvateil.combat?.catalogVersion || 0) < Number(combat.catalogVersion || 0)) {
    await reyvateilSnapshot.ref.set({ combat }, { merge: true });
  }
  const combatState = buildPlayerCombatState({ combat, uid: request.auth.uid, reyvateilId, level: 1 });
  await userRef.set({
    reyvateilId,
    reyvateilName: clean(reyvateil.name, 100),
    reyvateilLevel: 1,
    ...(imageUrl ? { reyvateilImageUrl: imageUrl } : {}),
    ...combatState,
  }, { merge: true });
  return {
    reyvateilId,
    specialtyTitle: combat.specialtyTitle,
    inheritedCombatAbilityIds: combatState.combatProfile.inheritedCombatAbilityIds,
    inheritedSocialAbilityIds: combatState.combatProfile.inheritedSocialAbilityIds,
  };
});

exports.adminSeedCombatProfiles = onCall({ region: 'europe-west1', cors: true, timeoutSeconds: 120 }, async (request) => {
  requireAdmin(request);
  const db = getFirestore();
  const users = await db.collection('users').get();
  const reyvateilSnapshots = await Promise.all(Object.keys(combatCatalog).map((id) => db.collection('reyvateils').doc(id).get()));
  const names = Object.fromEntries(reyvateilSnapshots.map((snapshot) => [snapshot.id, clean(snapshot.data()?.name, 100) || snapshot.id]));
  const operations = [
    ...Object.entries(combatCatalog).map(([id, combat]) => ({ type: 'reyvateil', ref: db.collection('reyvateils').doc(id), data: { combat } })),
    ...users.docs.flatMap((snapshot) => {
      const user = snapshot.data();
      const combat = combatCatalog[user.reyvateilId];
      if (!combat) return [];
      const combatState = buildPlayerCombatState({ combat, user, uid: snapshot.id, reyvateilId: user.reyvateilId });
      return [{ type: 'user', ref: snapshot.ref, data: {
        reyvateilName: user.reyvateilName || names[user.reyvateilId],
        ...combatState,
      } }];
    }),
  ];
  for (let offset = 0; offset < operations.length; offset += 400) {
    const batch = db.batch();
    operations.slice(offset, offset + 400).forEach((operation) => batch.set(operation.ref, operation.data, { merge: true }));
    await batch.commit();
  }
  return {
    reyvateils: operations.filter((operation) => operation.type === 'reyvateil').length,
    players: operations.filter((operation) => operation.type === 'user').length,
  };
});

exports.ensureCombatProfile = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const db = getFirestore();
  const userRef = db.collection('users').doc(request.auth.uid);
  const userSnapshot = await userRef.get();
  if (!userSnapshot.exists) throw new HttpsError('not-found', 'Your player profile is missing.');
  const user = userSnapshot.data();
  const reyvateilId = clean(user.reyvateilId, 80);
  if (!reyvateilId) throw new HttpsError('failed-precondition', 'Choose a Reyvateil before preparing combat.');
  const reyvateilRef = db.collection('reyvateils').doc(reyvateilId);
  const reyvateilSnapshot = await reyvateilRef.get();
  const registeredCombat = reyvateilSnapshot.data()?.combat;
  const combat = currentCombatCatalog(registeredCombat, reyvateilId);
  if (!combat || !Array.isArray(combat.combatSongs) || combat.combatSongs.length < 4) throw new HttpsError('failed-precondition', 'This Reyvateil has no complete combat and Song catalog.');
  const level = Math.max(1, Math.floor(Number(user.reyvateilLevel || user.level || 1)));
  const alreadyCurrent = Number(user.combatProfile?.version || 0) >= PLAYER_COMBAT_PROFILE_VERSION
    && Number(user.combatProfile?.catalogVersion || 0) >= Number(combat.catalogVersion || 0)
    && Number(user.combatProfile?.level || 0) === level;
  if (alreadyCurrent) return { initialized: false };
  const combatState = buildPlayerCombatState({ combat, user, uid: request.auth.uid, reyvateilId, level });
  const batch = db.batch();
  batch.set(reyvateilRef, { combat }, { merge: true });
  batch.set(userRef, {
    reyvateilName: user.reyvateilName || clean(reyvateilSnapshot.data()?.name, 100) || reyvateilId,
    ...combatState,
  }, { merge: true });
  await batch.commit();
  return { initialized: true, specialtyTitle: combat.specialtyTitle };
});

exports.advanceEncounterTurn = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  requireAdmin(request);
  const encounterId = clean(request.data?.encounterId, 128);
  if (!encounterId) throw new HttpsError('invalid-argument', 'An encounter ID is required.');
  const db = getFirestore();
  const encounterRef = db.collection('encounters').doc(encounterId);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(encounterRef);
    if (!snapshot.exists || snapshot.data().status !== 'active') throw new HttpsError('failed-precondition', 'This battle is no longer active.');
    const encounter = snapshot.data();
    const participants = Array.isArray(encounter.participants) ? encounter.participants.map((entry) => ({ ...entry })) : [];
    if (!participants.length || participants.some((entry) => entry.dead !== true && !Number.isFinite(Number(entry.initiative)))) {
      throw new HttpsError('failed-precondition', 'Enter initiative for every living combatant before starting turns.');
    }
    const sequence = initiativeSequence(participants);
    if (!sequence.length) throw new HttpsError('failed-precondition', 'No living combatants remain in initiative.');
    const previous = encounter.turn || { phase: 'initiative', round: 1, activeIndex: -1, serial: 0 };
    const oldIndex = previous.activeParticipantId ? sequence.indexOf(previous.activeParticipantId) : -1;
    let activeIndex = 0;
    let wrapped = false;
    if (previous.phase === 'active' && oldIndex >= 0) {
      activeIndex = (oldIndex + 1) % sequence.length;
      wrapped = activeIndex === 0;
    } else if (previous.phase === 'active' && previous.activeParticipantId) {
      // The acting combatant may have died during their turn. Continue from
      // their former position instead of restarting initiative at the top.
      const priorSequence = Array.isArray(previous.sequence) ? previous.sequence : [];
      const priorIndex = priorSequence.indexOf(previous.activeParticipantId);
      for (let offset = 1; priorIndex >= 0 && offset <= priorSequence.length; offset += 1) {
        const candidate = priorSequence[(priorIndex + offset) % priorSequence.length];
        const candidateIndex = sequence.indexOf(candidate);
        if (candidateIndex >= 0) {
          activeIndex = candidateIndex;
          wrapped = priorIndex + offset >= priorSequence.length;
          break;
        }
      }
    }
    const round = Math.max(1, Number(previous.round || 1) + (wrapped ? 1 : 0));
    const activeParticipantId = sequence[activeIndex];
    const active = participants.find((entry) => entry.id === activeParticipantId);
    participants.forEach((participant) => {
      const resources = participant.turnResources || freshTurnResources();
      if (participant.id === activeParticipantId) {
        participant.turnResources = { ...resources, actionAvailable: true, songAvailable: true, quickAvailable: false, reactionAvailable: true };
      } else {
        participant.turnResources = resources;
      }
    });
    const turn = {
      phase: 'active', round, activeIndex, activeParticipantId, sequence,
      serial: Number(previous.serial || 0) + 1,
      advancedAt: FieldValue.serverTimestamp(),
    };
    let activeSong = encounter.activeSong ? { ...encounter.activeSong } : null;
    const songLog = [];
    if (activeSong && previous.phase === 'active' && previous.activeParticipantId === activeSong.performerParticipantId
      && Number(activeSong.lastSustainedTurnSerial ?? -1) !== Number(previous.serial || 0)) {
      songLog.push({
        id: crypto.randomUUID(), action: 'ability-used', round,
        participantId: activeSong.performerParticipantId, participantName: clean(activeSong.performerName, 120),
        abilityId: activeSong.songId, abilityName: clean(activeSong.songName, 120), songEvent: 'canticle-unsustained', createdAtMs: Date.now(),
      });
      activeSong = null;
    }
    if (wrapped && activeSong?.stage === 'chanting' && round >= Number(activeSong.activatesAtRound || round)) {
      activeSong.stage = 'active';
      songLog.push({
        id: crypto.randomUUID(), action: 'ability-used', round,
        participantId: activeSong.performerParticipantId, participantName: clean(activeSong.performerName, 120),
        abilityId: activeSong.songId, abilityName: clean(activeSong.songName, 120), songEvent: 'canticle-activated', createdAtMs: Date.now(),
      });
    }
    if (wrapped && activeSong?.stage === 'active' && activeSong.endsAfterRound !== null && round > Number(activeSong.endsAfterRound)) {
      songLog.push({
        id: crypto.randomUUID(), action: 'ability-used', round,
        participantId: activeSong.performerParticipantId, participantName: clean(activeSong.performerName, 120),
        abilityId: activeSong.songId, abilityName: clean(activeSong.songName, 120), songEvent: 'canticle-ended', createdAtMs: Date.now(),
      });
      activeSong = null;
    }
    const combatLog = [...(encounter.combatLog || []), ...songLog, {
      id: crypto.randomUUID(), action: 'turn-started', round,
      participantId: active?.id, participantName: clean(active?.name, 120), createdAtMs: Date.now(),
    }].slice(-80);
    transaction.update(encounterRef, { participants, turn, activeSong, combatLog, updatedAt: FieldValue.serverTimestamp() });
    return { round, activeParticipantId, activeParticipantName: active?.name || '' };
  });
});

exports.activateCombatAbility = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const encounterId = clean(request.data?.encounterId, 128);
  const abilityId = clean(request.data?.abilityId, 180);
  if (!encounterId || !abilityId) throw new HttpsError('invalid-argument', 'Encounter and technique are required.');
  const db = getFirestore();
  const encounterRef = db.collection('encounters').doc(encounterId);
  const userRef = db.collection('users').doc(request.auth.uid);
  return db.runTransaction(async (transaction) => {
    const [encounterSnapshot, userSnapshot] = await Promise.all([transaction.get(encounterRef), transaction.get(userRef)]);
    if (!encounterSnapshot.exists || encounterSnapshot.data().status !== 'active') throw new HttpsError('failed-precondition', 'There is no active battle.');
    if (!userSnapshot.exists) throw new HttpsError('not-found', 'Your player profile is missing.');
    const encounter = encounterSnapshot.data();
    const player = userSnapshot.data();
    const participants = encounter.participants.map((entry) => ({ ...entry }));
    const participant = participants.find((entry) => entry.kind === 'player' && entry.sourceId === request.auth.uid);
    if (!participant) throw new HttpsError('permission-denied', 'You are not part of this encounter.');
    if (participant.dead === true || player.mortality?.dead === true) throw new HttpsError('failed-precondition', 'A deceased combatant cannot act. Only the administrator can invoke a revival.');
    let ability = universalCombatAbilities[abilityId];
    let song = null;
    if (!ability) {
      const inherited = player.combatProfile?.inheritedCombatAbilityIds || [];
      const reyvateilSnapshot = await transaction.get(db.collection('reyvateils').doc(clean(player.reyvateilId, 80)));
      const reyvateilId = clean(player.reyvateilId, 80);
      const registeredCombat = reyvateilSnapshot.data()?.combat;
      const combat = currentCombatCatalog(registeredCombat, reyvateilId);
      const technique = combat?.combatAbilities?.find((entry) => entry.id === abilityId);
      song = combat?.combatSongs?.find((entry) => entry.id === abilityId) || null;
      if (technique && !inherited.includes(abilityId)) throw new HttpsError('permission-denied', 'That technique was not inherited by your Reyvateil.');
      ability = technique || song;
    }
    if (!ability) throw new HttpsError('not-found', 'That combat technique or Song no longer exists.');
    if (Number(player.combatProfile?.level || 1) < Number(ability.levelRequired || 1)) {
      throw new HttpsError('failed-precondition', `That ${song ? 'Song' : 'technique'} unlocks at level ${ability.levelRequired}.`);
    }
    if (ability.actionType === 'passive') throw new HttpsError('failed-precondition', 'Passive techniques are always active.');
    const turn = encounter.turn;
    if (!turn || turn.phase !== 'active') throw new HttpsError('failed-precondition', 'The administrator has not started the first turn.');
    if (ability.actionType !== 'reaction' && turn.activeParticipantId !== participant.id) {
      throw new HttpsError('failed-precondition', 'Wait for your turn.');
    }
    const previousResources = participant.turnResources || {};
    const resources = { ...freshTurnResources(), ...previousResources };
    // Encounters opened before the Song/Quick economy stored Quick as ready at
    // turn start. Do not let that legacy shape grant a free follow-up.
    if (!Object.prototype.hasOwnProperty.call(previousResources, 'songAvailable')) resources.quickAvailable = false;
    resources.roundUses = { ...(resources.roundUses || {}) };
    resources.encounterUses = { ...(resources.encounterUses || {}) };
    if (song && !resources.songAvailable) throw new HttpsError('failed-precondition', 'Your Song has already been spent.');
    if (!song && ability.actionType === 'action' && !resources.actionAvailable) throw new HttpsError('failed-precondition', 'Your action has already been spent.');
    if (ability.actionType === 'quick' && !resources.quickAvailable) throw new HttpsError('failed-precondition', 'Use an Action technique before its Quick follow-up.');
    if (ability.actionType === 'reaction' && !resources.reactionAvailable) throw new HttpsError('failed-precondition', 'Your reaction has already been spent.');
    const round = Number(turn.round || 1);
    if (ability.reset === 'round' && resources.roundUses[ability.id] === round) throw new HttpsError('failed-precondition', 'That technique resets next round.');
    if (ability.reset === 'encounter' && Number(resources.encounterUses[ability.id] || 0) >= Number(ability.uses || 1)) throw new HttpsError('failed-precondition', 'That technique is spent for this encounter.');
    if (song) resources.songAvailable = false;
    if (!song && ability.actionType === 'action') {
      resources.actionAvailable = false;
      resources.quickAvailable = true;
    }
    if (ability.actionType === 'quick') resources.quickAvailable = false;
    if (ability.actionType === 'reaction') resources.reactionAvailable = false;
    if (ability.reset === 'round') resources.roundUses[ability.id] = round;
    if (ability.reset === 'encounter') resources.encounterUses[ability.id] = Number(resources.encounterUses[ability.id] || 0) + 1;
    participant.turnResources = resources;
    const interruptedSong = song?.songForm === 'canticle' ? encounter.activeSong || null : null;
    const activeSong = song?.songForm === 'canticle' ? {
      songId: song.id,
      songName: clean(song.name, 120),
      form: 'canticle',
      audience: song.audience || 'all-hearers',
      performerParticipantId: participant.id,
      performerSourceId: request.auth.uid,
      performerName: clean(participant.name, 120),
      stage: Number(song.chantRounds || 0) > 0 ? 'chanting' : 'active',
      startedRound: round,
      activatesAtRound: round + Number(song.chantRounds || 0),
      endsAfterRound: Number.isFinite(Number(song.durationRounds)) && song.durationRounds !== null
        ? round + Number(song.chantRounds || 0) + Number(song.durationRounds) - 1
        : null,
      lastSustainedTurnSerial: Number(turn.serial || 0),
      ...(song.audioUrl ? { audioUrl: clean(song.audioUrl, 2000) } : {}),
    } : encounter.activeSong || null;
    const combatLog = [...(encounter.combatLog || []), {
      id: crypto.randomUUID(), action: 'ability-used', round,
      participantId: participant.id, participantName: clean(participant.name, 120),
      abilityId: ability.id, abilityName: clean(ability.name, 120),
      ...(song ? { songForm: song.songForm, songEvent: song.songForm === 'verse' ? 'verse-resolved' : 'canticle-started' } : {}),
      ...(interruptedSong ? { interruptedSongId: interruptedSong.songId, interruptedSongName: clean(interruptedSong.songName, 120) } : {}),
      createdAtMs: Date.now(),
    }].slice(-80);
    transaction.update(encounterRef, { participants, activeSong, combatLog, updatedAt: FieldValue.serverTimestamp() });
    return { abilityId: ability.id, abilityName: ability.name, resources, activeSong };
  });
});

exports.continueCombatSong = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const encounterId = clean(request.data?.encounterId, 128);
  if (!encounterId) throw new HttpsError('invalid-argument', 'Encounter is required.');
  const db = getFirestore();
  const encounterRef = db.collection('encounters').doc(encounterId);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(encounterRef);
    if (!snapshot.exists || snapshot.data().status !== 'active') throw new HttpsError('failed-precondition', 'There is no active battle.');
    const encounter = snapshot.data();
    const turn = encounter.turn;
    const activeSong = encounter.activeSong ? { ...encounter.activeSong } : null;
    if (!activeSong) throw new HttpsError('failed-precondition', 'There is no Canticle to sustain.');
    if (activeSong.performerSourceId !== request.auth.uid) throw new HttpsError('permission-denied', 'Only the performer can sustain this Canticle.');
    const participants = (encounter.participants || []).map((entry) => ({ ...entry }));
    const participant = participants.find((entry) => entry.id === activeSong.performerParticipantId && entry.sourceId === request.auth.uid);
    if (!participant) throw new HttpsError('permission-denied', 'The performer is no longer in this encounter.');
    if (participant.dead === true) throw new HttpsError('failed-precondition', 'A deceased performer cannot sustain a Canticle.');
    if (!turn || turn.phase !== 'active' || turn.activeParticipantId !== participant.id) throw new HttpsError('failed-precondition', 'Sustain the Canticle during your turn.');
    const resources = { ...freshTurnResources(), ...(participant.turnResources || {}) };
    resources.roundUses = { ...(resources.roundUses || {}) };
    resources.encounterUses = { ...(resources.encounterUses || {}) };
    if (!resources.songAvailable) throw new HttpsError('failed-precondition', 'Your Song has already been spent.');
    resources.songAvailable = false;
    participant.turnResources = resources;
    activeSong.lastSustainedTurnSerial = Number(turn.serial || 0);
    const combatLog = [...(encounter.combatLog || []), {
      id: crypto.randomUUID(), action: 'ability-used', round: Number(turn.round || 1),
      participantId: participant.id, participantName: clean(participant.name, 120),
      abilityId: activeSong.songId, abilityName: clean(activeSong.songName, 120),
      songEvent: 'canticle-sustained', createdAtMs: Date.now(),
    }].slice(-80);
    transaction.update(encounterRef, { participants, activeSong, combatLog, updatedAt: FieldValue.serverTimestamp() });
    return { songId: activeSong.songId, songName: activeSong.songName, resources, activeSong };
  });
});

exports.applyMortalConsequence = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const consequence = clean(request.data?.consequence, 40);
  const detail = clean(request.data?.detail, 80);
  const db = getFirestore();
  const userRef = db.collection('users').doc(request.auth.uid);
  return db.runTransaction(async (transaction) => {
    const userSnapshot = await transaction.get(userRef);
    if (!userSnapshot.exists) throw new HttpsError('not-found', 'Your player profile is missing.');
    const user = userSnapshot.data();
    if (user.mortality?.dead === true) throw new HttpsError('failed-precondition', 'You are already dead. Only the administrator can invoke a revival.');
    const activeEncounter = await activeEncounterForUser(transaction, db, request.auth.uid);
    const currentHp = activeEncounter ? Number(activeEncounter.participant.hp) : Number(user.combatStats?.currentHp);
    if (!Number.isFinite(currentHp) || currentHp > 0) throw new HttpsError('failed-precondition', 'Mortal consequences can only be self-recorded after Reyvateil protection reaches 0 HP.');
    const mortality = applyMortalityConsequence(user.mortality, consequence, 1, detail);
    const userUpdate = { mortality };
    if (mortality.dead) userUpdate.combatStats = { ...(user.combatStats || {}), currentHp: 0 };
    transaction.set(userRef, userUpdate, { merge: true });
    if (activeEncounter) {
      activeEncounter.participant.dead = mortality.dead;
      if (mortality.dead) activeEncounter.participant.hp = 0;
      transaction.update(activeEncounter.ref, {
        participants: activeEncounter.participants,
        ...(mortality.dead && activeEncounter.activeSong?.performerSourceId === request.auth.uid ? { activeSong: null } : {}),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    return { mortality };
  });
});

exports.adminRevivePlayer = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  requireAdmin(request);
  const userId = clean(request.data?.userId, 128);
  if (!userId) throw new HttpsError('invalid-argument', 'Choose a player to revive.');
  const db = getFirestore();
  const userRef = db.collection('users').doc(userId);
  return db.runTransaction(async (transaction) => {
    const userSnapshot = await transaction.get(userRef);
    if (!userSnapshot.exists) throw new HttpsError('not-found', 'That player no longer exists.');
    const user = userSnapshot.data();
    const revivedAtMs = Date.now();
    const mortality = { ...normalizedMortality(user.mortality), dead: false, deathCause: '', updatedAtMs: revivedAtMs, revivedAtMs };
    const activeEncounter = await activeEncounterForUser(transaction, db, userId);
    transaction.update(userRef, { mortality, 'combatStats.currentHp': 1 });
    if (activeEncounter) {
      activeEncounter.participant.dead = false;
      activeEncounter.participant.hp = Math.max(1, Number(activeEncounter.participant.hp || 0));
      transaction.update(activeEncounter.ref, { participants: activeEncounter.participants, updatedAt: FieldValue.serverTimestamp() });
    }
    return { userId, mortality };
  });
});

exports.adminCreateUser = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  requireAdmin(request);
  const email = clean(request.data?.email, 254).toLowerCase();
  const password = typeof request.data?.password === 'string' ? request.data.password : '';
  if (!email || password.length < 6) {
    throw new HttpsError('invalid-argument', 'A valid email and a password of at least 6 characters are required.');
  }
  let created;
  try {
    created = await getAuth().createUser({ email, password });
    await getFirestore().collection('users').doc(created.uid).set({
      email, displayName: '', active: false, conditions: [], inventory: [], unlockedCyphers: [], unlockedRecipes: [],
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    if (created?.uid) await getAuth().deleteUser(created.uid).catch(() => undefined);
    console.error('Admin user creation failed', error);
    throw new HttpsError(error?.code === 'auth/email-already-exists' ? 'already-exists' : 'internal', error?.message || 'Could not create user.');
  }
  return { uid: created.uid, email };
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
      .filter((entry) => entry.id !== request.auth.uid && entry.data().active !== false && entry.data().mortality?.dead !== true)
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
    } else if (kind === 'damage') {
      const mortality = applyMortalityConsequence(userSnapshot.data().mortality, clean(delivery.resourceId, 40), amount, clean(delivery.damageDetail, 80));
      const activeEncounter = await activeEncounterForUser(transaction, db, targetUserId);
      const userUpdate = { mortality };
      if (mortality.dead) userUpdate.combatStats = { ...(userSnapshot.data().combatStats || {}), currentHp: 0 };
      transaction.set(userRef, userUpdate, { merge: true });
      if (activeEncounter) {
        activeEncounter.participant.dead = mortality.dead;
        if (mortality.dead) activeEncounter.participant.hp = 0;
        transaction.update(activeEncounter.ref, {
          participants: activeEncounter.participants,
          ...(mortality.dead && activeEncounter.activeSong?.performerSourceId === targetUserId ? { activeSong: null } : {}),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
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
