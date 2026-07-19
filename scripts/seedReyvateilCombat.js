const admin = require('firebase-admin');
const crypto = require('crypto');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, '../src/serviceAccountKey.json'));
const catalog = require(path.resolve(__dirname, '../src/generated/reyvateilCombatCatalog.json'));
const reyvateils = require(path.resolve(__dirname, '../src/reyvateils.json'));
const reyvateilNames = Object.fromEntries(reyvateils.map((entry) => [entry.id, entry.name]));

admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId: 'hyzik-5edfd' });
const db = admin.firestore();
const dryRun = process.argv.includes('--dry-run');

const deterministicSubset = (ids, count, seed) => [...ids]
  .map((id) => ({ id, score: crypto.createHash('sha256').update(`${seed}:${id}`).digest('hex') }))
  .sort((a, b) => a.score.localeCompare(b.score))
  .slice(0, count)
  .map((entry) => entry.id);

const run = async () => {
  const users = await db.collection('users').get();
  const eligible = users.docs.filter((snapshot) => Boolean(catalog[snapshot.data().reyvateilId]));
  if (dryRun) {
    console.log(`Dry run: ${Object.keys(catalog).length} Reyvateil documents and ${eligible.length}/${users.size} player profiles would be merged.`);
    return;
  }
  const reyvateilBatch = db.batch();
  Object.entries(catalog).forEach(([id, combat]) => {
    reyvateilBatch.set(db.collection('reyvateils').doc(id), { combat }, { merge: true });
  });
  await reyvateilBatch.commit();

  let migrated = 0;
  for (let offset = 0; offset < users.docs.length; offset += 400) {
    const batch = db.batch();
    users.docs.slice(offset, offset + 400).forEach((snapshot) => {
      const user = snapshot.data();
      const combat = catalog[user.reyvateilId];
      if (!combat) return;
      const previousHp = Number(user.combatStats?.currentHp);
      const currentHp = Number.isFinite(previousHp) && previousHp >= 0 ? Math.min(previousHp, combat.derived.maxHp) : combat.derived.maxHp;
      const existingCombatIds = user.combatProfile?.inheritedCombatAbilityIds;
      const existingSocialIds = user.combatProfile?.inheritedSocialAbilityIds;
      batch.set(snapshot.ref, {
        reyvateilName: user.reyvateilName || reyvateilNames[user.reyvateilId] || user.reyvateilId,
        combatProfile: {
          version: 1,
          specialtyTitle: combat.specialtyTitle,
          role: combat.role,
          level: Number(user.reyvateilLevel || user.level || 1),
          aptitudes: combat.aptitudes,
          derived: combat.derived,
          inheritedCombatAbilityIds: Array.isArray(existingCombatIds) && existingCombatIds.length ? existingCombatIds : deterministicSubset(combat.combatAbilities.map((ability) => ability.id), 5, `${snapshot.id}:${user.reyvateilId}:combat-v1`),
          // Existing campaigns keep every social ability they already know. New
          // selection flows receive a varied five-of-ten draw server-side.
          inheritedSocialAbilityIds: Array.isArray(existingSocialIds) && existingSocialIds.length ? existingSocialIds : combat.socialAbilities.slice(0, 5).map((ability) => ability.id),
          assignedAt: user.combatProfile?.assignedAt || admin.firestore.FieldValue.serverTimestamp(),
        },
        combatStats: { currentHp, maxHp: combat.derived.maxHp, armorClass: combat.derived.defense },
      }, { merge: true });
      migrated += 1;
    });
    await batch.commit();
  }
  console.log(`Seeded ${Object.keys(catalog).length} Reyvateils and migrated ${migrated} player combat profiles.`);
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
