const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue, FieldPath } = require('firebase-admin/firestore');
const crypto = require('crypto');
const combatCatalog = require('./combatCatalog.json');
const lootTroves = require('./lootTroves.json');
const { config: economyConfig, factionById, normalizeEconomy, deriveItemEconomy, donationQuote, purchaseQuote } = require('./economy');
const { rollLootBundle, sourceTierFromLabel } = require('./lootEngine');
const { encounterDiscoveries, advanceDiscovery, discoveryId } = require('./bestiaryDiscovery');

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
    const dailyUses = { ...(player.combatDailyUses || {}) };
    if (song && !resources.songAvailable) throw new HttpsError('failed-precondition', 'Your Song has already been spent.');
    if (!song && ability.actionType === 'action' && !resources.actionAvailable) throw new HttpsError('failed-precondition', 'Your action has already been spent.');
    if (ability.actionType === 'quick' && !resources.quickAvailable) throw new HttpsError('failed-precondition', 'Use an Action technique before its Quick follow-up.');
    if (ability.actionType === 'reaction' && !resources.reactionAvailable) throw new HttpsError('failed-precondition', 'Your reaction has already been spent.');
    const round = Number(turn.round || 1);
    if (ability.reset === 'round' && resources.roundUses[ability.id] === round) throw new HttpsError('failed-precondition', 'That technique resets next round.');
    if (ability.reset === 'encounter' && Number(resources.encounterUses[ability.id] || 0) >= Number(ability.uses || 1)) throw new HttpsError('failed-precondition', 'That technique is spent for this encounter.');
    if (ability.reset === 'daily' && Number(dailyUses[ability.id] || 0) >= Number(ability.uses || 1)) throw new HttpsError('failed-precondition', 'That technique is spent until a qualifying rest.');
    if (song) resources.songAvailable = false;
    if (!song && ability.actionType === 'action') {
      resources.actionAvailable = false;
      resources.quickAvailable = true;
    }
    if (ability.actionType === 'quick') resources.quickAvailable = false;
    if (ability.actionType === 'reaction') resources.reactionAvailable = false;
    if (ability.reset === 'round') resources.roundUses[ability.id] = round;
    if (ability.reset === 'encounter') resources.encounterUses[ability.id] = Number(resources.encounterUses[ability.id] || 0) + 1;
    if (ability.reset === 'daily') dailyUses[ability.id] = Number(dailyUses[ability.id] || 0) + 1;
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
    if (ability.reset === 'daily') transaction.update(userRef, { combatDailyUses: dailyUses });
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

exports.adminEndEncounter = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  requireAdmin(request);
  const encounterId = clean(request.data?.encounterId, 128);
  if (!encounterId) throw new HttpsError('invalid-argument', 'Encounter is required.');
  const db = getFirestore();
  const encounterRef = db.collection('encounters').doc(encounterId);
  const campaignRef = db.collection('campaign').doc('current');

  return db.runTransaction(async (transaction) => {
    const [encounterSnapshot] = await Promise.all([transaction.get(encounterRef), transaction.get(campaignRef)]);
    if (!encounterSnapshot.exists) throw new HttpsError('not-found', 'That encounter no longer exists.');
    const encounter = encounterSnapshot.data();
    if (encounter.status !== 'active') throw new HttpsError('failed-precondition', 'That battle has already ended.');

    const candidates = encounterDiscoveries(encounter.participants || []);
    const categoryIds = [...new Set(candidates.map((entry) => entry.categoryId))];
    const categoryRefs = new Map(categoryIds.map((categoryId) => [categoryId, db.collection('bestiary').doc(categoryId)]));
    const categorySnapshots = await Promise.all(categoryIds.map((categoryId) => transaction.get(categoryRefs.get(categoryId))));
    const categoryData = new Map(categoryIds.map((categoryId, index) => [categoryId, categorySnapshots[index].exists ? categorySnapshots[index].data() : null]));
    const known = candidates.filter((entry) => categoryData.get(entry.categoryId)?.[entry.speciesName]?.Tiers);
    const progressRefs = known.map((entry) => db.collection('bestiaryProgress').doc(discoveryId(entry.categoryId, entry.speciesName)));
    const progressSnapshots = await Promise.all(progressRefs.map((ref) => transaction.get(ref)));

    const fieldUpdates = new Map();
    const results = known.map((entry, index) => {
      const species = categoryData.get(entry.categoryId)[entry.speciesName];
      const result = advanceDiscovery({
        categoryId: entry.categoryId,
        speciesName: entry.speciesName,
        species,
        previous: progressSnapshots[index].exists ? progressSnapshots[index].data() : {},
        tierIds: entry.tierIds,
      });
      const updates = fieldUpdates.get(entry.categoryId) || [];
      updates.push(
        new FieldPath(entry.speciesName, 'Locked'), false,
        new FieldPath(entry.speciesName, 'LoreLocked'), false,
        new FieldPath(entry.speciesName, 'DiscoveryManaged'), true,
        new FieldPath(entry.speciesName, 'LoreUnlockCount'), result.loreUnlockCount,
        new FieldPath(entry.speciesName, 'EncounterCount'), result.encounterCount,
      );
      result.unlockedTiers.forEach((tierId) => {
        if (species.Tiers?.[tierId]) updates.push(new FieldPath(entry.speciesName, 'Tiers', tierId, 'Locked'), false);
      });
      fieldUpdates.set(entry.categoryId, updates);
      transaction.set(progressRefs[index], {
        categoryId: result.categoryId,
        speciesName: result.speciesName,
        encounterCount: result.encounterCount,
        tierEncounterCounts: result.tierEncounterCounts,
        unlockedTiers: result.unlockedTiers,
        loreUnlockCount: result.loreUnlockCount,
        lastEncounterId: encounterId,
        updatedAt: FieldValue.serverTimestamp(),
        ...(result.baseUnlocked ? { firstEncounterId: encounterId, discoveredAt: FieldValue.serverTimestamp() } : {}),
      }, { merge: true });
      return result;
    });

    fieldUpdates.forEach((updates, categoryId) => transaction.update(categoryRefs.get(categoryId), ...updates));
    (encounter.participants || []).filter((participant) => participant.kind === 'player').forEach((participant) => {
      const maxHp = Math.max(1, Number.isFinite(Number(participant.maxHp)) ? Number(participant.maxHp) : 1);
      const currentHp = Number.isFinite(Number(participant.hp)) ? Number(participant.hp) : maxHp;
      transaction.update(db.collection('users').doc(participant.sourceId), {
        'combatStats.currentHp': Math.max(0, Math.min(maxHp, currentHp)),
      });
    });
    transaction.update(encounterRef, {
      status: 'complete',
      activeSong: null,
      endedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      bestiaryDiscovery: results.map((result) => ({
        categoryId: result.categoryId,
        speciesName: result.speciesName,
        baseUnlocked: result.baseUnlocked,
        loreUnlockCount: result.loreUnlockCount,
        newlyUnlockedLoreField: result.newlyUnlockedLoreField || '',
        newlyUnlockedTiers: result.newlyUnlockedTiers,
      })),
    });
    transaction.set(campaignRef, {
      activeEncounterId: '', battleActive: false, timersPaused: false,
      timersResumedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return {
      discoveries: results.map((result) => ({
        categoryId: result.categoryId,
        speciesName: result.speciesName,
        baseUnlocked: result.baseUnlocked,
        loreUnlocked: result.newlyUnlockedLoreField || '',
        tierUnlocked: result.newlyUnlockedTiers,
        encounterCount: result.encounterCount,
      })),
    };
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
      email, displayName: '', active: false, conditions: [], inventory: [], unlockedCyphers: [], unlockedRecipes: [], economy: normalizeEconomy(),
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

exports.rollLootSource = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const sourceKind = clean(request.data?.sourceKind, 20);
  const db = getFirestore();
  let source;
  let sourceTier = 1;
  let sourceLabel = '';
  if (sourceKind === 'trove') {
    const categoryId = clean(request.data?.categoryId, 120);
    const tierId = clean(request.data?.tierId, 120);
    const category = (lootTroves.categories || []).find((entry) => entry.category === categoryId);
    source = category?.tiers?.find((entry) => entry.id === tierId);
    if (!source) throw new HttpsError('not-found', 'That loot source no longer exists.');
    sourceLabel = clean(source.name, 120) || tierId;
    const tierIndex = category.tiers.findIndex((entry) => entry.id === tierId);
    sourceTier = Math.max(1, Math.min(4, tierIndex + 1));
  } else if (sourceKind === 'monster') {
    const categoryId = clean(request.data?.categoryId, 120);
    const monsterName = clean(request.data?.monsterName, 180);
    const tierId = clean(request.data?.tierId, 120);
    const categorySnapshot = await db.collection('bestiary').doc(categoryId).get();
    const monster = categorySnapshot.data()?.[monsterName];
    source = monster?.Tiers?.[tierId];
    if (!source) throw new HttpsError('not-found', 'That monster tier no longer exists.');
    sourceLabel = clean(source.Name, 120) || `${tierId} ${monsterName}`;
    sourceTier = /avatar|reyvateil/i.test(`${categoryId} ${monsterName}`) ? 4 : sourceTierFromLabel(`${tierId} ${sourceLabel}`, 'monster');
  } else {
    throw new HttpsError('invalid-argument', 'Choose a monster or trove loot source.');
  }
  const rolled = rollLootBundle(source.loot || source.Loot, {
    sourceTier,
    maxItems: sourceKind === 'trove' ? Number(source.maxAmountOfItems || 1) : 1,
  });
  const tangible = rolled.filter((entry) => String(entry.itemName).toLowerCase() !== 'nothing');
  if (!tangible.length) return { count: 0, sourceLabel, sourceTier, items: [], jackpot: false };
  const finderSnapshot = await db.collection('users').doc(request.auth.uid).get();
  if (!finderSnapshot.exists) throw new HttpsError('not-found', 'Your player profile is missing.');
  const itemSnapshots = await Promise.all(tangible.map((entry) => db.doc(itemPath(entry.itemName)).get()));
  const missing = itemSnapshots.filter((snapshot) => !snapshot.exists).map((_, index) => tangible[index].itemName);
  if (missing.length) throw new HttpsError('failed-precondition', `Loot table references missing item records: ${missing.join(', ')}.`);
  const batch = db.batch();
  const groupId = `loot-${Date.now()}-${request.auth.uid}`;
  tangible.forEach((entry, index) => {
    const itemSnapshot = itemSnapshots[index];
    const deliveryRef = db.collection('grantDeliveries').doc();
    batch.set(deliveryRef, {
      groupId,
      recipientId: request.auth.uid,
      senderId: request.auth.uid,
      senderName: clean(finderSnapshot.data().displayName, 80) || 'A party member',
      kind: 'item', resourceId: entry.itemName,
      label: clean(itemSnapshot.data().name, 120) || entry.itemName,
      amount: entry.quantity, source: 'loot', status: 'waiting', audienceIds: [],
      lootRarity: entry.rarity, lootJackpot: entry.jackpot === true,
      lootSource: sourceLabel, lootSourceTier: sourceTier,
      createdAt: FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();
  return { count: tangible.length, sourceLabel, sourceTier, items: tangible, jackpot: tangible.some((entry) => entry.jackpot) };
});

exports.donateInventoryItem = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const itemId = clean(request.data?.itemId, 180);
  const factionId = clean(request.data?.factionId, 80);
  const amount = quantity(request.data?.amount);
  if (!itemId || !factionById[factionId]) throw new HttpsError('invalid-argument', 'Choose an item and receiving faction.');
  const db = getFirestore();
  const userRef = db.collection('users').doc(request.auth.uid);
  const itemRef = db.doc(itemPath(itemId));
  const ledgerRef = db.collection('economyTransactions').doc();
  return db.runTransaction(async (transaction) => {
    const [userSnapshot, itemSnapshot] = await Promise.all([transaction.get(userRef), transaction.get(itemRef)]);
    if (!userSnapshot.exists || !itemSnapshot.exists) throw new HttpsError('not-found', 'The player or item record is missing.');
    let quote;
    try { quote = donationQuote(itemSnapshot.data(), factionId, amount); }
    catch (error) { throw new HttpsError('invalid-argument', error.message); }
    const inventory = removeInventoryEntry(userSnapshot.data().inventory, itemRef, amount);
    const economy = normalizeEconomy(userSnapshot.data().economy);
    economy.favor += quote.favor;
    economy.lifetimeFavorEarned += quote.favor;
    economy.donatedItemCount += amount;
    economy.donatedValue += quote.favorValue * amount;
    economy.reputation[factionId] += quote.reputation;
    economy.factionContributions[factionId].items += amount;
    economy.factionContributions[factionId].favor += quote.favor;
    const playerName = clean(userSnapshot.data().displayName, 80) || 'Unnamed player';
    transaction.update(userRef, { inventory, economy });
    transaction.set(ledgerRef, {
      kind: 'donation', playerId: request.auth.uid, playerName,
      factionId, factionName: quote.faction.name,
      itemId, itemName: clean(itemSnapshot.data().name, 120) || itemId, quantity: amount,
      favorDelta: quote.favor, reputationDelta: quote.reputation,
      note: quote.preferred ? 'Priority civic need' : 'Accepted outside the faction’s normal specialty',
      createdAtMs: Date.now(), createdAt: FieldValue.serverTimestamp(),
    });
    return { economy, favorEarned: quote.favor, reputationEarned: quote.reputation, preferred: quote.preferred, factionName: quote.faction.name };
  });
});

exports.purchaseCityItem = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const itemId = clean(request.data?.itemId, 180);
  const factionId = clean(request.data?.factionId, 80);
  const vendorName = clean(request.data?.vendorName, 120);
  const amount = Math.max(1, Math.min(99, quantity(request.data?.amount)));
  const faction = factionById[factionId];
  if (!itemId || !faction) throw new HttpsError('invalid-argument', 'Choose an item and city faction.');
  if (vendorName && !faction.vendors.includes(vendorName)) throw new HttpsError('invalid-argument', 'That vendor does not belong to the selected faction.');
  const db = getFirestore();
  const userRef = db.collection('users').doc(request.auth.uid);
  const itemRef = db.doc(itemPath(itemId));
  const campaignRef = db.collection('campaign').doc('current');
  const ledgerRef = db.collection('economyTransactions').doc();
  return db.runTransaction(async (transaction) => {
    const [userSnapshot, itemSnapshot, campaignSnapshot] = await Promise.all([
      transaction.get(userRef), transaction.get(itemRef), transaction.get(campaignRef),
    ]);
    if (!userSnapshot.exists || !itemSnapshot.exists) throw new HttpsError('not-found', 'The player or item record is missing.');
    const economy = normalizeEconomy(userSnapshot.data().economy);
    let quote;
    try { quote = purchaseQuote(itemSnapshot.data(), factionId, economy.reputation[factionId], amount, vendorName || faction.vendors[0]); }
    catch (error) { throw new HttpsError('failed-precondition', error.message); }
    const requiredReputation = { common: 0, uncommon: 0, rare: 25, epic: 60, legendary: 120, artifact: Number.MAX_SAFE_INTEGER }[quote.rarity] || 0;
    if (economy.reputation[factionId] < requiredReputation) throw new HttpsError('failed-precondition', `This ${quote.rarity} stock requires ${requiredReputation} reputation with ${faction.name}.`);
    if (quote.rarity === 'artifact') throw new HttpsError('failed-precondition', 'Artifacts cannot be bought from ordinary city stock.');
    if (economy.favor < quote.totalPrice) throw new HttpsError('failed-precondition', `You need ${quote.totalPrice - economy.favor} more Favor.`);
    economy.favor -= quote.totalPrice;
    economy.lifetimeFavorSpent += quote.totalPrice;
    const worldMode = campaignSnapshot.data()?.worldMode === 'dungeon' ? 'dungeon' : 'town';
    const reservationId = crypto.randomUUID();
    const itemName = clean(itemSnapshot.data().name, 120) || itemId;
    const playerName = clean(userSnapshot.data().displayName, 80) || 'Unnamed player';
    const reservations = Array.isArray(userSnapshot.data().purchaseReservations)
      ? [...userSnapshot.data().purchaseReservations]
      : [];
    if (worldMode === 'dungeon') {
      if (reservations.length >= 200) throw new HttpsError('resource-exhausted', 'Your reservation queue is full. Return to town before reserving more goods.');
      reservations.push({
        id: reservationId, itemId, itemName, quantity: amount,
        factionId, factionName: faction.name, vendorName: quote.vendorName,
        totalPrice: quote.totalPrice, createdAtMs: Date.now(),
      });
      transaction.update(userRef, { purchaseReservations: reservations, economy });
    } else {
      transaction.update(userRef, { inventory: addInventoryEntry(userSnapshot.data().inventory, itemRef, amount), economy });
    }
    transaction.set(ledgerRef, {
      kind: worldMode === 'dungeon' ? 'reservation' : 'purchase', playerId: request.auth.uid, playerName,
      factionId, factionName: faction.name, vendorName: quote.vendorName,
      itemId, itemName, quantity: amount,
      favorDelta: -quote.totalPrice, reputationDelta: 0,
      note: worldMode === 'dungeon'
        ? `Paid at ${quote.tier.name} rate; reserved for the next return to town`
        : `${quote.tier.name} rate · ${quote.tier.discountPercent}% reputation discount`,
      createdAtMs: Date.now(), createdAt: FieldValue.serverTimestamp(),
    });
    return {
      economy, itemId, amount, totalPrice: quote.totalPrice, unitPrice: quote.unitPrice,
      status: worldMode === 'dungeon' ? 'reserved' : 'acquired',
      ...(worldMode === 'dungeon' ? { reservationId } : {}),
    };
  });
});

exports.adminSetWorldMode = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  requireAdmin(request);
  const worldMode = clean(request.data?.worldMode, 20);
  if (!['town', 'dungeon'].includes(worldMode)) throw new HttpsError('invalid-argument', 'Choose town or dungeon mode.');
  const db = getFirestore();
  const campaignRef = db.collection('campaign').doc('current');
  const listedUsers = await db.collection('users').get();
  return db.runTransaction(async (transaction) => {
    const [campaignSnapshot, ...userSnapshots] = await Promise.all([
      transaction.get(campaignRef),
      ...listedUsers.docs.map((entry) => transaction.get(entry.ref)),
    ]);
    let fulfilledReservations = 0;
    if (worldMode === 'town') {
      userSnapshots.forEach((snapshot) => {
        if (!snapshot.exists) return;
        const user = snapshot.data();
        const reservations = Array.isArray(user.purchaseReservations) ? user.purchaseReservations : [];
        if (!reservations.length) return;
        let inventory = [...(user.inventory || [])];
        const playerName = clean(user.displayName, 80) || 'Unnamed player';
        reservations.forEach((reservation) => {
          const reservedItemId = clean(reservation.itemId, 180);
          const reservedAmount = quantity(reservation.quantity);
          if (!reservedItemId) return;
          inventory = addInventoryEntry(inventory, db.doc(itemPath(reservedItemId)), reservedAmount);
          transaction.set(db.collection('economyTransactions').doc(), {
            kind: 'reservation-fulfilled', playerId: snapshot.id, playerName,
            factionId: clean(reservation.factionId, 80), factionName: clean(reservation.factionName, 120),
            vendorName: clean(reservation.vendorName, 120), itemId: reservedItemId,
            itemName: clean(reservation.itemName, 120) || reservedItemId, quantity: reservedAmount,
            favorDelta: 0, reputationDelta: 0,
            note: `Reserved on campaign day ${Number(campaignSnapshot.data()?.day || 1)}; delivered on return to town`,
            createdAtMs: Date.now(), createdAt: FieldValue.serverTimestamp(),
          });
          fulfilledReservations += 1;
        });
        transaction.update(snapshot.ref, { inventory, purchaseReservations: [] });
      });
    }
    transaction.set(campaignRef, { worldMode, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return { worldMode, fulfilledReservations };
  });
});

exports.adminAdvanceDay = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  requireAdmin(request);
  const requestedRests = Array.isArray(request.data?.rests) ? request.data.rests.slice(0, 200) : [];
  const restByUser = new Map(requestedRests.map((entry) => [
    clean(entry?.userId, 128),
    Math.max(0, Math.min(24, Math.floor(Number(entry?.hours || 0)))),
  ]).filter(([userId]) => Boolean(userId)));
  const db = getFirestore();
  const campaignRef = db.collection('campaign').doc('current');
  const listedUsers = await db.collection('users').get();
  return db.runTransaction(async (transaction) => {
    const [campaignSnapshot, ...userSnapshots] = await Promise.all([
      transaction.get(campaignRef),
      ...listedUsers.docs.map((entry) => transaction.get(entry.ref)),
    ]);
    if (campaignSnapshot.data()?.battleActive === true) throw new HttpsError('failed-precondition', 'End the active battle before advancing the campaign day.');
    let restedPlayers = 0;
    let dailyResets = 0;
    userSnapshots.forEach((snapshot) => {
      if (!snapshot.exists) return;
      const user = snapshot.data();
      const hours = restByUser.get(snapshot.id) || 0;
      const dead = user.mortality?.dead === true;
      const maxHp = Math.max(1, Math.floor(Number(user.combatStats?.maxHp || user.combatProfile?.derived?.maxHp || 1)));
      const currentHp = Math.max(0, Math.min(maxHp, Math.floor(Number(user.combatStats?.currentHp ?? maxHp))));
      const healedHp = dead ? currentHp : Math.min(maxHp, currentHp + Math.ceil((maxHp * hours) / 6));
      if (hours > 0 && !dead) restedPlayers += 1;
      const update = {
        'combatStats.currentHp': healedHp,
        'combatStats.maxHp': maxHp,
        lastRestHours: hours,
      };
      if (hours >= 5 && !dead) {
        update.combatDailyUses = {};
        update.dailyResetVersion = Math.max(0, Math.floor(Number(user.dailyResetVersion || 0))) + 1;
        update.lastDailyResetAt = FieldValue.serverTimestamp();
        dailyResets += 1;
      }
      transaction.update(snapshot.ref, update);
    });
    const day = Math.max(1, Math.floor(Number(campaignSnapshot.data()?.day || 1))) + 1;
    transaction.set(campaignRef, {
      day, lastDayAdvancedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    return { day, restedPlayers, dailyResets };
  });
});

exports.adminRecordBarter = onCall({ region: 'europe-west1', cors: true }, async (request) => {
  requireAdmin(request);
  const userId = clean(request.data?.userId, 128);
  const factionId = clean(request.data?.factionId, 80);
  const vendorName = clean(request.data?.vendorName, 120);
  const note = clean(request.data?.note, 500);
  const favorDelta = Math.max(-100000, Math.min(100000, Math.floor(Number(request.data?.favorDelta || 0))));
  const reputationDelta = Math.max(-1000, Math.min(1000, Math.floor(Number(request.data?.reputationDelta || 0))));
  const faction = factionById[factionId];
  if (!userId || !faction || !note || (!favorDelta && !reputationDelta)) throw new HttpsError('invalid-argument', 'Choose a player and faction, enter a change, and describe the barter.');
  const db = getFirestore();
  const userRef = db.collection('users').doc(userId);
  const ledgerRef = db.collection('economyTransactions').doc();
  return db.runTransaction(async (transaction) => {
    const userSnapshot = await transaction.get(userRef);
    if (!userSnapshot.exists) throw new HttpsError('not-found', 'That player no longer exists.');
    const economy = normalizeEconomy(userSnapshot.data().economy);
    if (economy.favor + favorDelta < 0) throw new HttpsError('failed-precondition', 'That barter would reduce Favor below zero.');
    const appliedReputation = Math.max(-economy.reputation[factionId], reputationDelta);
    economy.favor += favorDelta;
    economy.reputation[factionId] += appliedReputation;
    if (favorDelta > 0) economy.lifetimeFavorEarned += favorDelta;
    if (favorDelta < 0) economy.lifetimeFavorSpent += Math.abs(favorDelta);
    const playerName = clean(userSnapshot.data().displayName, 80) || 'Unnamed player';
    transaction.update(userRef, { economy });
    transaction.set(ledgerRef, {
      kind: 'barter', playerId: userId, playerName,
      factionId, factionName: faction.name, vendorName: vendorName || faction.vendors[0],
      favorDelta, reputationDelta: appliedReputation, note,
      createdAtMs: Date.now(), createdAt: FieldValue.serverTimestamp(),
    });
    return { economy };
  });
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
      recipientName: clean(targetSnapshot.data().displayName, 80) || 'Unnamed player',
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
  const ledgerRef = db.collection('economyTransactions').doc();
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
    transaction.set(ledgerRef, {
      kind: accept ? 'transfer' : 'transfer-declined',
      playerId: clean(delivery.senderId, 128), playerName: clean(delivery.senderName, 80) || 'A party member',
      counterpartyPlayerId: request.auth.uid, counterpartyName: clean(delivery.recipientName, 80) || (accept ? clean(ownerSnapshot.data().displayName, 80) : 'Unnamed player'),
      itemId: clean(delivery.resourceId, 180), itemName: clean(delivery.label, 120), quantity: quantity(delivery.amount),
      favorDelta: 0, reputationDelta: 0,
      note: accept ? 'Player-to-player transfer accepted' : 'Player-to-player transfer declined and returned',
      createdAtMs: Date.now(), createdAt: FieldValue.serverTimestamp(),
    });
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
