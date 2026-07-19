const fs = require('fs');
const path = require('path');
const { RARITIES, inferEntryRarity, sourceTierFromLabel } = require('../functions-admin/lootEngine');

const root = path.resolve(__dirname, '..');
const itemDirectory = path.join(root, 'src', 'dataSets', 'items');
const itemNames = new Set(fs.readdirSync(itemDirectory).filter((name) => name.endsWith('.json')).flatMap((name) => JSON.parse(fs.readFileSync(path.join(itemDirectory, name), 'utf8'))).map((item) => item.name));
const troves = JSON.parse(fs.readFileSync(path.join(root, 'src', 'dataSets', 'lootTroves.json'), 'utf8'));
const sources = [];
troves.categories.forEach((category) => category.tiers.forEach((tier) => sources.push({ kind: 'trove', label: `${category.category} ${tier.id}`, tier: sourceTierFromLabel(tier.id, 'trove'), loot: tier.loot })));
['slimes.js', 'constructs.js', 'beasts.js', 'aberrations.js', 'avatars.js', 'Reyvateils.js'].forEach((file) => {
  const catalog = require(path.join(root, 'src', 'dataSets', file));
  Object.values(catalog).forEach((species) => Object.entries(species.Tiers || {}).forEach(([tierName, tier]) => sources.push({ kind: 'monster', label: `${species.Name || 'Monster'} ${tierName}`, tier: sourceTierFromLabel(`${species.Name || ''} ${tierName}`, 'monster'), loot: tier.Loot || [] })));
});
const errors = [];
sources.forEach((source) => {
  source.loot.forEach((entry) => {
    if (!entry.itemName) errors.push(`${source.label}: loot entry has no itemName.`);
    if (entry.itemName === 'Gold Coin') errors.push(`${source.label}: Gold Coin is forbidden.`);
    if (entry.itemName !== 'Nothing' && !itemNames.has(entry.itemName)) errors.push(`${source.label}: unknown item "${entry.itemName}".`);
    const rarity = inferEntryRarity(entry, source.tier);
    if (!RARITIES.includes(rarity)) errors.push(`${source.label}: invalid rarity "${rarity}".`);
  });
});
console.log(`Validated ${sources.length} loot sources against ${itemNames.size} item definitions.`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Every loot entry resolves; no currency remains in loot tables.');
