const config = require('./economyConfig.json');

const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact'];
const factionById = Object.fromEntries(config.factions.map((faction) => [faction.id, faction]));

const finiteInt = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
};

const normalizeEconomy = (value = {}) => ({
  favor: Math.max(0, finiteInt(value.favor)),
  reputation: Object.fromEntries(config.factions.map((faction) => [faction.id, Math.max(0, finiteInt(value.reputation?.[faction.id]))])),
  lifetimeFavorEarned: Math.max(0, finiteInt(value.lifetimeFavorEarned)),
  lifetimeFavorSpent: Math.max(0, finiteInt(value.lifetimeFavorSpent)),
  donatedItemCount: Math.max(0, finiteInt(value.donatedItemCount)),
  donatedValue: Math.max(0, finiteInt(value.donatedValue)),
  factionContributions: Object.fromEntries(config.factions.map((faction) => [faction.id, {
    items: Math.max(0, finiteInt(value.factionContributions?.[faction.id]?.items)),
    favor: Math.max(0, finiteInt(value.factionContributions?.[faction.id]?.favor)),
  }])),
});

const inferredRarity = (item = {}) => {
  const category = String(item.category || '');
  const text = `${item.name || ''} ${category}`.toLowerCase();
  if (/artifact/.test(text)) return 'artifact';
  if (/legendary/.test(text)) return 'legendary';
  if (/advanced materials|leveling component/.test(category.toLowerCase())) return 'rare';
  if (/weapon|armor|wondrous|ritual/.test(category.toLowerCase())) return 'uncommon';
  const recipeSize = Array.isArray(item.recipe) ? item.recipe.length : 0;
  return rarityOrder[Math.min(2, Math.floor(recipeSize / 3))];
};

const deriveItemEconomy = (item = {}) => {
  const override = config.itemOverrides[item.name] || {};
  const rarity = rarityOrder.includes(item.rarity) ? item.rarity : override.rarity || inferredRarity(item);
  const base = Number(config.rarityValues[rarity] || config.rarityValues.common);
  const multiplier = Number(config.categoryMultipliers[item.category] || 1);
  const recipeBonus = Math.min(1.5, 1 + Math.max(0, (Array.isArray(item.recipe) ? item.recipe.length : 0) - 1) * .08);
  const favorValue = Math.max(1, finiteInt(item.favorValue || override.favorValue || Math.round(base * multiplier * recipeBonus), 1));
  const purchasePrice = Math.max(favorValue + 1, finiteInt(item.purchasePrice || override.purchasePrice || Math.ceil(favorValue * 3.25), favorValue + 1));
  const preferredFactionIds = Array.isArray(item.preferredFactionIds) && item.preferredFactionIds.length
    ? item.preferredFactionIds.filter((id) => factionById[id])
    : Array.isArray(override.preferredFactionIds) ? override.preferredFactionIds
      : config.factions.filter((faction) => faction.preferredCategories.includes(item.category)).map((faction) => faction.id);
  return { rarity, favorValue, purchasePrice, preferredFactionIds };
};

const donationQuote = (item, factionId, amount) => {
  const faction = factionById[factionId];
  if (!faction) throw new Error('Unknown faction.');
  const itemEconomy = deriveItemEconomy(item);
  const quantity = Math.max(1, Math.min(9999, finiteInt(amount, 1)));
  const preferred = itemEconomy.preferredFactionIds.includes(factionId);
  const relevanceMultiplier = preferred ? 1.25 : .8;
  const favor = Math.max(1, Math.round(itemEconomy.favorValue * quantity * relevanceMultiplier));
  const reputation = Math.max(1, Math.ceil(favor / 6));
  return { ...itemEconomy, faction, quantity, preferred, relevanceMultiplier, favor, reputation };
};

const reputationTier = (reputation) => [...config.reputationTiers].reverse().find((tier) => finiteInt(reputation) >= tier.minimum) || config.reputationTiers[0];

const vendorStocksItem = (vendorName, item = {}) => Array.isArray(config.vendorStock?.[vendorName])
  && config.vendorStock[vendorName].includes(item.category);

const purchaseQuote = (item, factionId, reputation, amount, vendorName) => {
  const faction = factionById[factionId];
  if (!faction) throw new Error('Unknown faction.');
  const selectedVendor = vendorName || faction.vendors[0];
  if (!faction.vendors.includes(selectedVendor)) throw new Error('That vendor does not belong to the selected faction.');
  if (!vendorStocksItem(selectedVendor, item)) throw new Error(`${selectedVendor} does not stock this type of item.`);
  const itemEconomy = deriveItemEconomy(item);
  const available = itemEconomy.preferredFactionIds.includes(factionId) || faction.preferredCategories.includes(item.category);
  if (!available) throw new Error('That faction does not normally stock this item.');
  const quantity = Math.max(1, Math.min(99, finiteInt(amount, 1)));
  const tier = reputationTier(reputation);
  const unitPrice = Math.max(1, Math.ceil(itemEconomy.purchasePrice * (1 - tier.discountPercent / 100)));
  return { ...itemEconomy, faction, vendorName: selectedVendor, quantity, tier, unitPrice, totalPrice: unitPrice * quantity };
};

module.exports = { config, factionById, normalizeEconomy, deriveItemEconomy, donationQuote, reputationTier, purchaseQuote, vendorStocksItem };
