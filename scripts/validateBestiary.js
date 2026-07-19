const catalog = require('./bestiaryCatalog');

const repeatableCategories = ['Slime', 'Construct', 'Beast', 'Aberration'];
const errors = [];
let speciesCount = 0;
let tierCount = 0;
let chaosCount = 0;

const positive = (value) => Number.isFinite(Number(value)) && Number(value) > 0;

for (const categoryId of repeatableCategories) {
  const category = catalog[categoryId];
  const serializedBytes = Buffer.byteLength(JSON.stringify(category), 'utf8');
  if (serializedBytes > 950000) errors.push(`${categoryId}: serialized document is ${serializedBytes} bytes and risks Firestore's 1 MiB limit.`);
  for (const [speciesName, species] of Object.entries(category)) {
    if (speciesName === 'description') continue;
    speciesCount += 1;
    if (!species.Lore?.Formation || !species.Lore?.Habitat || !species.Lore?.Behavior || !species.Lore?.Rarity) errors.push(`${categoryId}/${speciesName}: incomplete lore.`);
    if (species.DiscoveryManaged !== true || species.Locked !== true || species.LoreLocked !== true || Number(species.LoreUnlockCount) !== 0) errors.push(`${categoryId}/${speciesName}: authored discovery defaults must begin fully hidden.`);
    const tiers = species.Tiers || {};
    const chaosSlime = categoryId === 'Slime' && speciesName === 'Chaos Slime';
    if (chaosSlime) {
      if (Object.keys(tiers).join('|') !== 'Minor|Regular|Greater') errors.push('Slime/Chaos Slime: must have exactly Minor, Regular, and Greater tiers.');
      if (Object.values(tiers).some((tier) => !tier.ChaosTier)) errors.push('Slime/Chaos Slime: every tier must be a Chaos tier.');
    } else if (!tiers.Chaos?.ChaosTier) errors.push(`${categoryId}/${speciesName}: missing highest Chaos tier.`);

    for (const [tierId, tier] of Object.entries(tiers)) {
      tierCount += 1;
      const label = `${categoryId}/${speciesName}/${tierId}`;
      if (!positive(tier.Stats?.['Hit Points'])) errors.push(`${label}: Hit Points missing.`);
      if (!positive(tier.Stats?.Defence)) errors.push(`${label}: Defence missing.`);
      if (!positive(tier.Stats?.['Attack Bonus'])) errors.push(`${label}: Attack Bonus missing.`);
      if (!positive(tier.Stats?.['Save Difficulty'])) errors.push(`${label}: Save Difficulty missing.`);
      if (!tier.SongHearing) errors.push(`${label}: Song Hearing missing.`);
      if (typeof tier.Locked !== 'boolean') errors.push(`${label}: Locked must be an explicit boolean.`);
      if (!Array.isArray(tier.Abilities) || !tier.Abilities.some((ability) => /against Defence/.test(ability))) errors.push(`${label}: authoritative attack text missing.`);
      if (!Array.isArray(tier.Loot) || !tier.Loot.length) errors.push(`${label}: loot table missing.`);
      if (tier.ChaosTier) {
        chaosCount += 1;
        if (!Array.isArray(tier.ChaosTable) || tier.ChaosTable.length < 6) errors.push(`${label}: Chaos table requires at least six outcomes.`);
      }
    }
  }
}

for (const [speciesName, species] of Object.entries(catalog.Reyvateil)) {
  if (speciesName === 'description') continue;
  if (species.Tiers?.Chaos) errors.push(`Reyvateil/${speciesName}: unique Reyvateil must not receive a generic Chaos tier.`);
}

console.log(`Validated ${speciesCount} repeatable species, ${tierCount} combat tiers, and ${chaosCount} Chaos stat blocks.`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Every repeatable species has complete combat data and an explicit Chaos apex; unique Reyvateil remain exempt.');
