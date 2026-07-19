const test = require('node:test');
const assert = require('node:assert/strict');
const { JACKPOT_CHANCE, inferEntryRarity, rollLootBundle } = require('./lootEngine');

const sequence = (...values) => {
  let index = 0;
  return () => values[Math.min(index++, values.length - 1)];
};

test('jackpot probability is exactly one in 150 primary rolls', () => {
  assert.equal(JACKPOT_CHANCE, 1 / 150);
});

test('source tiers hard-cap explicit rarity', () => {
  assert.equal(inferEntryRarity({ itemName: 'Impossible Relic', rarity: 'artifact', itemChance: 1 }, 1), 'rare');
  assert.equal(inferEntryRarity({ itemName: 'Impossible Relic', rarity: 'artifact', itemChance: 1 }, 2), 'epic');
  assert.equal(inferEntryRarity({ itemName: 'Impossible Relic', rarity: 'artifact', itemChance: 1 }, 3), 'legendary');
  assert.equal(inferEntryRarity({ itemName: 'Impossible Relic', rarity: 'artifact', itemChance: 1 }, 4), 'artifact');
});

test('a jackpot selects the highest tangible rarity and never Nothing', () => {
  const result = rollLootBundle([
    { itemName: 'Nothing', itemChance: 90, rarity: 'common' },
    { itemName: 'Useful Scrap', itemChance: 9, rarity: 'common' },
    { itemName: 'Singular Relic', itemChance: 1, rarity: 'artifact' },
  ], { sourceTier: 4, maxItems: 1, random: sequence(0, .5, .5) });
  assert.deepEqual(result, [{ itemName: 'Singular Relic', quantity: 1, rarity: 'artifact', jackpot: true }]);
});

test('only the primary item in a multi-item bundle can jackpot', () => {
  const result = rollLootBundle([
    { itemName: 'Scrap', itemChance: 99, rarity: 'common' },
    { itemName: 'Relic', itemChance: 1, rarity: 'artifact' },
  ], { sourceTier: 4, maxItems: 4, random: sequence(.2, .2, 0, .5, .5, 0, .99, .5) });
  assert.equal(result.filter((entry) => entry.jackpot).length <= 1, true);
});
