const test = require('node:test');
const assert = require('node:assert/strict');
const { config, purchaseQuote, vendorStocksItem } = require('./economy');

test('every configured vendor has a distinct, explicit stock definition', () => {
  config.factions.forEach((faction) => {
    const signatures = faction.vendors.map((vendor) => {
      assert.ok(Array.isArray(config.vendorStock[vendor]), `${vendor} is missing stock categories`);
      assert.ok(config.vendorStock[vendor].length > 0, `${vendor} has empty stock`);
      return [...config.vendorStock[vendor]].sort().join('|');
    });
    assert.equal(new Set(signatures).size, signatures.length, `${faction.name} contains vendors with identical stock`);
    faction.preferredCategories.forEach((category) => {
      assert.ok(faction.vendors.some((vendor) => config.vendorStock[vendor].includes(category)), `${faction.name} never stocks ${category}`);
    });
  });
});

test('a vendor cannot sell another shop’s category', () => {
  const potion = { name: 'Health Potion', category: 'Consumables', recipe: [] };
  assert.equal(vendorStocksItem('The Healing Hand Clinic', potion), true);
  assert.equal(vendorStocksItem("The Alchemist's Alembic", potion), false);
  assert.doesNotThrow(() => purchaseQuote(potion, 'healing-concord', 0, 1, 'The Healing Hand Clinic'));
  assert.throws(
    () => purchaseQuote(potion, 'healing-concord', 0, 1, "The Alchemist's Alembic"),
    /does not stock this type of item/,
  );
});
