import { factionDonationQuote, factionPrice, itemEconomy, reputationTier } from './economy';
import { Item } from '../types/Reyvateils';

const potion: Item = { id: 'Health Potion', name: 'Health Potion', description: 'Restores life.', category: 'Consumables', recipe: [] };

test('explicit potion economics are stable', () => {
  expect(itemEconomy(potion)).toMatchObject({ rarity: 'uncommon', favorValue: 16, purchasePrice: 55 });
});

test('a relevant faction rewards a donation more than an unrelated faction', () => {
  expect(factionDonationQuote(potion, 'healing-concord', 2).favor).toBeGreaterThan(factionDonationQuote(potion, 'silent-shadows', 2).favor);
});

test('reputation discounts prices without consuming reputation', () => {
  expect(reputationTier(60).name).toBe('Allied');
  expect(factionPrice(potion, 60).price).toBeLessThan(factionPrice(potion, 0).price);
});
