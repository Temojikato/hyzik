const test = require('node:test');
const assert = require('node:assert/strict');
const { encounterDiscoveries, advanceDiscovery } = require('./bestiaryDiscovery');

const earth = {
  Locked: true,
  Lore: { Formation: 'one', 'Social Tendencies': 'two', Habitat: 'three', Behavior: 'four', Rarity: 'five' },
  Tiers: { Minor: { Locked: true }, Regular: { Locked: true }, Greater: { Locked: true }, Chaos: { Locked: true } },
};

test('an encounter counts a species and tier once regardless of duplicate bodies', () => {
  const discoveries = encounterDiscoveries([
    { kind: 'monster', sourceId: 'Slime|Earth Slime|Minor' },
    { kind: 'monster', sourceId: 'Slime|Earth Slime|Minor' },
    { kind: 'monster', sourceId: 'Slime|Earth Slime|Regular' },
    { kind: 'player', sourceId: 'player-1' },
  ]);
  assert.equal(discoveries.length, 1);
  assert.deepEqual(discoveries[0].tierIds.sort(), ['Minor', 'Regular']);
});

test('first encounter unlocks the base entry and first lore line, not a tier', () => {
  const result = advanceDiscovery({ categoryId: 'Slime', speciesName: 'Earth Slime', species: earth, tierIds: ['Minor'] });
  assert.equal(result.baseUnlocked, true);
  assert.equal(result.loreUnlockCount, 1);
  assert.equal(result.newlyUnlockedLoreField, 'Formation');
  assert.deepEqual(result.newlyUnlockedTiers, []);
  assert.equal(result.tierEncounterCounts.Minor, 1);
});

test('second encounter with the same tier unlocks that tier and the next lore line', () => {
  const first = advanceDiscovery({ categoryId: 'Slime', speciesName: 'Earth Slime', species: earth, tierIds: ['Minor'] });
  const second = advanceDiscovery({ categoryId: 'Slime', speciesName: 'Earth Slime', species: earth, previous: first, tierIds: ['Minor'] });
  assert.equal(second.baseUnlocked, false);
  assert.equal(second.loreUnlockCount, 2);
  assert.equal(second.newlyUnlockedLoreField, 'Social Tendencies');
  assert.deepEqual(second.newlyUnlockedTiers, ['Minor']);
});

test('a different tier requires its own second encounter', () => {
  const first = advanceDiscovery({ categoryId: 'Slime', speciesName: 'Earth Slime', species: earth, tierIds: ['Minor'] });
  const second = advanceDiscovery({ categoryId: 'Slime', speciesName: 'Earth Slime', species: earth, previous: first, tierIds: ['Regular'] });
  assert.deepEqual(second.newlyUnlockedTiers, []);
  const third = advanceDiscovery({ categoryId: 'Slime', speciesName: 'Earth Slime', species: earth, previous: second, tierIds: ['Regular'] });
  assert.deepEqual(third.newlyUnlockedTiers, ['Regular']);
});

test('lore progression stops at the number of authored fields', () => {
  let progress = {};
  for (let index = 0; index < 8; index += 1) progress = advanceDiscovery({ categoryId: 'Slime', speciesName: 'Earth Slime', species: earth, previous: progress, tierIds: [] });
  assert.equal(progress.encounterCount, 8);
  assert.equal(progress.loreUnlockCount, 5);
  assert.equal(progress.newlyUnlockedLoreField, null);
});
