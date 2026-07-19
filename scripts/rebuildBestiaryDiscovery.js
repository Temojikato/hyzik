const catalog = require('./bestiaryCatalog');
const { encounterDiscoveries, advanceDiscovery, discoveryId } = require('../functions-admin/bestiaryDiscovery');

const categoryIds = ['Slime', 'Construct', 'Beast', 'Aberration', 'Avatar', 'Reyvateil'];

const resetCatalog = () => {
  categoryIds.forEach((categoryId) => {
    Object.entries(catalog[categoryId]).forEach(([speciesName, species]) => {
      if (speciesName === 'description') return;
      species.Locked = true;
      species.LoreLocked = true;
      species.DiscoveryManaged = true;
      species.LoreUnlockCount = 0;
      species.EncounterCount = 0;
      Object.values(species.Tiers || {}).forEach((tier) => { tier.Locked = true; });
    });
  });
};

const run = async () => {
  if (process.env.HYZIK_USE_FIREBASE_CLI !== 'true') throw new Error('Set HYZIK_USE_FIREBASE_CLI=true to rebuild discovery from live encounters.');
  const rest = require('./firebaseCliFirestore');
  resetCatalog();
  const encounters = (await rest.listDocuments('encounters'))
    .filter((encounter) => encounter.status === 'complete')
    .sort((left, right) => new Date(left.startedAt || left.createdAt || 0) - new Date(right.startedAt || right.createdAt || 0));
  const progress = new Map();

  encounters.forEach((encounter) => {
    encounterDiscoveries(encounter.participants || []).forEach((entry) => {
      const species = catalog[entry.categoryId]?.[entry.speciesName];
      if (!species?.Tiers) return;
      const id = discoveryId(entry.categoryId, entry.speciesName);
      const next = advanceDiscovery({
        categoryId: entry.categoryId,
        speciesName: entry.speciesName,
        species,
        previous: progress.get(id) || {},
        tierIds: entry.tierIds,
      });
      next.firstEncounterId = progress.get(id)?.firstEncounterId || encounter.id;
      next.lastEncounterId = encounter.id;
      progress.set(id, next);
    });
  });

  categoryIds.forEach((categoryId) => {
    Object.entries(catalog[categoryId]).forEach(([speciesName, species]) => {
      if (speciesName === 'description') return;
      const state = progress.get(discoveryId(categoryId, speciesName));
      if (!state) return;
      species.Locked = false;
      species.LoreLocked = false;
      species.LoreUnlockCount = state.loreUnlockCount;
      species.EncounterCount = state.encounterCount;
      state.unlockedTiers.forEach((tierId) => {
        if (species.Tiers?.[tierId]) species.Tiers[tierId].Locked = false;
      });
    });
  });

  for (const categoryId of categoryIds) await rest.mergeDocument('bestiary', categoryId, catalog[categoryId]);
  for (const [id, state] of progress) {
    await rest.mergeDocument('bestiaryProgress', id, {
      categoryId: state.categoryId,
      speciesName: state.speciesName,
      encounterCount: state.encounterCount,
      tierEncounterCounts: state.tierEncounterCounts,
      unlockedTiers: state.unlockedTiers,
      loreUnlockCount: state.loreUnlockCount,
      firstEncounterId: state.firstEncounterId,
      lastEncounterId: state.lastEncounterId,
      rebuiltAtMs: Date.now(),
    });
  }
  console.log(`Rebuilt bestiary discovery from ${encounters.length} completed encounters across ${progress.size} discovered species.`);
};

if (require.main === module) run().catch((error) => { console.error(error); process.exitCode = 1; });
module.exports = { run };
