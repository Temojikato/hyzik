const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact'];
const JACKPOT_CHANCE = 1 / 150;
const SOURCE_MAX_RARITY = { 1: 'rare', 2: 'epic', 3: 'legendary', 4: 'artifact' };
const NORMAL_CURVES = {
  1: { common: .8, uncommon: .2 },
  2: { common: .64, uncommon: .3, rare: .06 },
  3: { common: .46, uncommon: .31, rare: .18, epic: .05 },
  4: { common: .31, uncommon: .3, rare: .24, epic: .1, legendary: .05 },
};

const clampTier = (value) => Math.max(1, Math.min(4, Math.floor(Number(value || 1))));
const rarityIndex = (rarity) => Math.max(0, RARITIES.indexOf(rarity));

const inferEntryRarity = (entry, sourceTier) => {
  if (RARITIES.includes(entry.rarity)) {
    const max = SOURCE_MAX_RARITY[clampTier(sourceTier)];
    return RARITIES[Math.min(rarityIndex(entry.rarity), rarityIndex(max))];
  }
  if (String(entry.itemName).toLowerCase() === 'nothing') return 'common';
  const chance = Number(entry.itemChance || 0);
  const inferred = chance < 5 ? 'legendary' : chance <= 10 ? 'epic' : chance <= 15 ? 'rare' : chance <= 25 ? 'uncommon' : 'common';
  const max = SOURCE_MAX_RARITY[clampTier(sourceTier)];
  return RARITIES[Math.min(rarityIndex(inferred), rarityIndex(max))];
};

const parseQuantity = (quantity, random = Math.random) => {
  if (!quantity) return 1;
  const [rawMin, rawMax] = String(quantity).split('-');
  const min = Math.max(1, Math.floor(Number(rawMin) || 1));
  const max = Math.max(min, Math.floor(Number(rawMax) || min));
  return min + Math.floor(random() * (max - min + 1));
};

const weightedPick = (entries, random) => {
  const total = entries.reduce((sum, entry) => sum + Math.max(.001, Number(entry.itemChance || 1)), 0);
  let roll = random() * total;
  for (const entry of entries) {
    roll -= Math.max(.001, Number(entry.itemChance || 1));
    if (roll < 0) return entry;
  }
  return entries[entries.length - 1];
};

const normalRarity = (sourceTier, random) => {
  const curve = NORMAL_CURVES[clampTier(sourceTier)];
  let roll = random();
  for (const rarity of RARITIES) {
    roll -= Number(curve[rarity] || 0);
    if (roll < 0) return rarity;
  }
  return 'common';
};

const closestPool = (entries, desiredRarity, sourceTier) => {
  const decorated = entries.map((entry) => ({ ...entry, resolvedRarity: inferEntryRarity(entry, sourceTier) }));
  const desired = rarityIndex(desiredRarity);
  for (let distance = 0; distance < RARITIES.length; distance += 1) {
    const lower = desired - distance;
    if (lower >= 0) {
      const pool = decorated.filter((entry) => rarityIndex(entry.resolvedRarity) === lower);
      if (pool.length) return pool;
    }
    const higher = desired + distance;
    if (distance && higher < RARITIES.length) {
      const pool = decorated.filter((entry) => rarityIndex(entry.resolvedRarity) === higher);
      if (pool.length) return pool;
    }
  }
  return decorated;
};

const rollOne = (entries, sourceTier, { allowJackpot = true, random = Math.random } = {}) => {
  const jackpot = allowJackpot && random() < JACKPOT_CHANCE;
  let pool;
  let desiredRarity;
  if (jackpot) {
    const decorated = entries.map((entry) => ({ ...entry, resolvedRarity: inferEntryRarity(entry, sourceTier) }));
    const highest = Math.max(...decorated.map((entry) => rarityIndex(entry.resolvedRarity)));
    pool = decorated.filter((entry) => rarityIndex(entry.resolvedRarity) === highest && String(entry.itemName).toLowerCase() !== 'nothing');
    desiredRarity = RARITIES[highest];
  } else {
    desiredRarity = normalRarity(sourceTier, random);
    pool = closestPool(entries, desiredRarity, sourceTier);
  }
  if (!pool.length) return null;
  const entry = weightedPick(pool, random);
  return {
    itemName: entry.itemName,
    quantity: parseQuantity(entry.quantity, random),
    rarity: entry.resolvedRarity || inferEntryRarity(entry, sourceTier),
    jackpot,
  };
};

const rollCount = (maxItems, sourceTier, random) => {
  const max = Math.max(1, Math.min(4, Math.floor(Number(maxItems || 1))));
  if (max === 1) return 1;
  if (max === 2) return 1 + (random() < .35 ? 1 : 0);
  if (max === 3) return 1 + (random() < .45 ? 1 : 0) + (random() < .15 ? 1 : 0);
  return Math.min(max, 2 + (random() < .35 ? 1 : 0) + (random() < .1 ? 1 : 0));
};

const rollLootBundle = (loot, { sourceTier = 1, maxItems = 1, random = Math.random } = {}) => {
  const entries = Array.isArray(loot) ? loot.filter((entry) => entry?.itemName) : [];
  const guaranteed = entries.filter((entry) => Number(entry.itemChance) >= 100).map((entry) => ({
    itemName: entry.itemName,
    quantity: parseQuantity(entry.quantity, random),
    rarity: inferEntryRarity(entry, sourceTier),
    jackpot: false,
  }));
  const candidates = entries.filter((entry) => Number(entry.itemChance) < 100);
  const count = candidates.length ? rollCount(maxItems, sourceTier, random) : 0;
  const rolled = [];
  for (let index = 0; index < count; index += 1) {
    const result = rollOne(candidates, sourceTier, { allowJackpot: index === 0, random });
    if (result) rolled.push(result);
  }
  const merged = new Map();
  [...guaranteed, ...rolled].forEach((entry) => {
    const existing = merged.get(entry.itemName);
    if (existing) {
      existing.quantity += entry.quantity;
      existing.jackpot = existing.jackpot || entry.jackpot;
      if (rarityIndex(entry.rarity) > rarityIndex(existing.rarity)) existing.rarity = entry.rarity;
    } else merged.set(entry.itemName, { ...entry });
  });
  return [...merged.values()];
};

const sourceTierFromLabel = (label, sourceKind = 'monster') => {
  const text = String(label || '').toLowerCase();
  if (/avatar|ancient|orichalcum|celestial|royal|grand|mythic/.test(text)) return 4;
  if (/greater|gold|glimmer|luxurious/.test(text)) return 3;
  if (/regular|silver|rich|hidden|forest|fishing spot/.test(text)) return 2;
  return sourceKind === 'trove' && /serene|cave/.test(text) ? 4 : 1;
};

module.exports = { RARITIES, JACKPOT_CHANCE, NORMAL_CURVES, inferEntryRarity, parseQuantity, rollLootBundle, sourceTierFromLabel };
