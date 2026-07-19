import economyConfig from '../data/economyConfig.json';
import { Item } from '../types/Reyvateils';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'artifact';
export type EconomyFaction = typeof economyConfig.factions[number];

export const ECONOMY_FACTIONS = economyConfig.factions;
export const REPUTATION_TIERS = economyConfig.reputationTiers;
export const VENDOR_STOCK = economyConfig.vendorStock as Record<string, string[]>;

export const vendorStocksItem = (vendorName: string, item: Pick<Item, 'category'>) =>
  (VENDOR_STOCK[vendorName] || []).includes(item.category);

const rarityOrder: ItemRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact'];

export const reputationTier = (reputation: number) => [...REPUTATION_TIERS]
  .reverse()
  .find((tier) => reputation >= tier.minimum) || REPUTATION_TIERS[0];

const inferredRarity = (item: Pick<Item, 'name' | 'category' | 'recipe'>): ItemRarity => {
  const category = item.category || '';
  const text = `${item.name} ${category}`.toLowerCase();
  if (/artifact/.test(text)) return 'artifact';
  if (/legendary/.test(text)) return 'legendary';
  if (/advanced materials|leveling component/.test(category.toLowerCase())) return 'rare';
  if (/weapon|armor|wondrous|ritual/.test(category.toLowerCase())) return 'uncommon';
  const recipeSize = Array.isArray(item.recipe) ? item.recipe.length : 0;
  return rarityOrder[Math.min(2, Math.floor(recipeSize / 3))];
};

export const itemEconomy = (item: Item) => {
  const override = (economyConfig.itemOverrides as Record<string, { rarity?: ItemRarity; favorValue?: number; purchasePrice?: number; preferredFactionIds?: string[] }>)[item.name];
  const rarity = item.rarity || override?.rarity || inferredRarity(item);
  const base = economyConfig.rarityValues[rarity];
  const multiplier = (economyConfig.categoryMultipliers as Record<string, number>)[item.category] || 1;
  const recipeBonus = Math.min(1.5, 1 + Math.max(0, (item.recipe?.length || 0) - 1) * .08);
  const favorValue = item.favorValue || override?.favorValue || Math.max(1, Math.round(base * multiplier * recipeBonus));
  const purchasePrice = item.purchasePrice || override?.purchasePrice || Math.max(favorValue + 1, Math.ceil(favorValue * 3.25));
  const preferredFactionIds = item.preferredFactionIds || override?.preferredFactionIds || ECONOMY_FACTIONS.filter((faction) => faction.preferredCategories.includes(item.category)).map((faction) => faction.id);
  return { rarity, favorValue, purchasePrice, preferredFactionIds };
};

export const factionDonationQuote = (item: Item, factionId: string, amount: number) => {
  const economy = itemEconomy(item);
  const preferred = economy.preferredFactionIds.includes(factionId);
  const relevanceMultiplier = preferred ? 1.25 : .8;
  const favor = Math.max(1, Math.round(economy.favorValue * Math.max(1, amount) * relevanceMultiplier));
  const reputation = Math.max(1, Math.ceil(favor / 6));
  return { ...economy, preferred, relevanceMultiplier, favor, reputation };
};

export const factionPrice = (item: Item, reputation: number) => {
  const economy = itemEconomy(item);
  const tier = reputationTier(reputation);
  return { ...economy, tier, price: Math.max(1, Math.ceil(economy.purchasePrice * (1 - tier.discountPercent / 100))) };
};
