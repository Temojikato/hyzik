const crypto = require('crypto');

const LORE_FIELDS = ['Formation', 'Social Tendencies', 'Habitat', 'Behavior', 'Rarity'];

const discoveryId = (categoryId, speciesName) => crypto
  .createHash('sha256')
  .update(`${categoryId}\u0000${speciesName}`)
  .digest('hex')
  .slice(0, 32);

const parseMonsterParticipant = (participant) => {
  if (participant?.kind !== 'monster') return null;
  const parts = String(participant.sourceId || '').split('|');
  if (parts.length < 3) return null;
  const categoryId = parts.shift();
  const tierId = parts.pop();
  const speciesName = parts.join('|');
  if (!categoryId || !speciesName || !tierId) return null;
  return { categoryId, speciesName, tierId };
};

const encounterDiscoveries = (participants = []) => {
  const species = new Map();
  participants.forEach((participant) => {
    const parsed = parseMonsterParticipant(participant);
    if (!parsed) return;
    const key = `${parsed.categoryId}\u0000${parsed.speciesName}`;
    const current = species.get(key) || { categoryId: parsed.categoryId, speciesName: parsed.speciesName, tierIds: new Set() };
    current.tierIds.add(parsed.tierId);
    species.set(key, current);
  });
  return [...species.values()].map((entry) => ({ ...entry, tierIds: [...entry.tierIds] }));
};

const loreFieldsFor = (species = {}) => LORE_FIELDS.filter((field) => {
  const value = species.Lore?.[field];
  return typeof value === 'string' && value.trim().length > 0;
});

const advanceDiscovery = ({ categoryId, speciesName, species, previous = {}, tierIds = [] }) => {
  const previousEncounterCount = Math.max(0, Math.floor(Number(previous.encounterCount || 0)));
  const encounterCount = previousEncounterCount + 1;
  const tierEncounterCounts = { ...(previous.tierEncounterCounts || {}) };
  const alreadyUnlockedTiers = new Set(Array.isArray(previous.unlockedTiers) ? previous.unlockedTiers : []);
  const newlyUnlockedTiers = [];

  [...new Set(tierIds)].forEach((tierId) => {
    const next = Math.max(0, Math.floor(Number(tierEncounterCounts[tierId] || 0))) + 1;
    tierEncounterCounts[tierId] = next;
    if (next >= 2 && species.Tiers?.[tierId] && !alreadyUnlockedTiers.has(tierId)) {
      alreadyUnlockedTiers.add(tierId);
      newlyUnlockedTiers.push(tierId);
    }
  });

  const loreFields = loreFieldsFor(species);
  const previousLoreCount = Math.min(loreFields.length, Math.max(0, Math.floor(Number(previous.loreUnlockCount || 0))));
  const loreUnlockCount = Math.min(loreFields.length, encounterCount);
  const newlyUnlockedLoreField = loreUnlockCount > previousLoreCount ? loreFields[loreUnlockCount - 1] : null;

  return {
    id: discoveryId(categoryId, speciesName),
    categoryId,
    speciesName,
    encounterCount,
    tierEncounterCounts,
    unlockedTiers: [...alreadyUnlockedTiers],
    loreUnlockCount,
    baseUnlocked: previousEncounterCount === 0,
    newlyUnlockedLoreField,
    newlyUnlockedTiers,
  };
};

module.exports = {
  LORE_FIELDS,
  discoveryId,
  parseMonsterParticipant,
  encounterDiscoveries,
  loreFieldsFor,
  advanceDiscovery,
};
