const DAMAGE_DICE = ['1d6 + 2', '2d6 + 3', '3d8 + 5', '4d10 + 6', '5d10 + 7', '6d12 + 8'];

const ROLE_MODIFIERS = {
  balanced: { hp: 0, defence: 0, initiative: 0, movement: 0, force: 0, finesse: 0, guard: 0, focus: 0, tempo: 0, resonance: 0 },
  brute: { hp: 18, defence: -1, initiative: -2, movement: -1, force: 3, finesse: -2, guard: 3, focus: -1, tempo: -2, resonance: -1 },
  guardian: { hp: 12, defence: 2, initiative: -1, movement: -1, force: 1, finesse: -1, guard: 4, focus: 1, tempo: -1, resonance: 0 },
  skirmisher: { hp: -8, defence: 1, initiative: 3, movement: 2, force: -1, finesse: 4, guard: -1, focus: 0, tempo: 3, resonance: 0 },
  artillery: { hp: -10, defence: 0, initiative: 1, movement: 0, force: -1, finesse: 2, guard: -1, focus: 4, tempo: 1, resonance: 2 },
  controller: { hp: 0, defence: 1, initiative: 0, movement: 0, force: -1, finesse: 0, guard: 1, focus: 3, tempo: 0, resonance: 4 },
  support: { hp: -4, defence: 1, initiative: 1, movement: 0, force: -2, finesse: 0, guard: 1, focus: 3, tempo: 2, resonance: 4 },
  ambusher: { hp: -6, defence: 1, initiative: 4, movement: 1, force: 0, finesse: 4, guard: -1, focus: 2, tempo: 3, resonance: 1 },
};

const DEFAULT_TIERS = [
  { key: 'Minor', rank: 1 },
  { key: 'Regular', rank: 2 },
  { key: 'Greater', rank: 3 },
  { key: 'Chaos', rank: 4, chaos: true },
];

const CHAOS_SLIME_TIERS = [
  { key: 'Minor', rank: 4, chaos: true },
  { key: 'Regular', rank: 5, chaos: true },
  { key: 'Greater', rank: 6, chaos: true },
];

const titleCase = (value) => String(value || '').replace(/\b\w/g, (character) => character.toUpperCase());
const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const unique = (values) => [...new Set(values.filter(Boolean))];

const profileFor = (rank, roleName) => {
  const role = ROLE_MODIFIERS[roleName] || ROLE_MODIFIERS.balanced;
  const baseHp = [0, 28, 64, 128, 232, 324, 432][rank] || 432 + (rank - 6) * 120;
  const baseAptitude = 1 + rank;
  return {
    hp: Math.max(1, baseHp + role.hp * rank),
    defence: clamp(12 + rank + role.defence, 8, 25),
    initiative: Math.max(-4, rank - 1 + role.initiative),
    movement: Math.max(1, 5 + role.movement),
    attackBonus: 3 + rank,
    saveDifficulty: 11 + rank,
    damage: DAMAGE_DICE[Math.min(DAMAGE_DICE.length - 1, rank - 1)],
    force: Math.max(0, baseAptitude + role.force),
    finesse: Math.max(0, baseAptitude + role.finesse),
    guard: Math.max(0, baseAptitude + role.guard),
    focus: Math.max(0, baseAptitude + role.focus),
    tempo: Math.max(0, baseAptitude + role.tempo),
    resonance: Math.max(0, baseAptitude + role.resonance),
  };
};

const render = (text, profile, blueprint) => String(text || '')
  .replaceAll('{attack}', `+${profile.attackBonus}`)
  .replaceAll('{dc}', String(profile.saveDifficulty))
  .replaceAll('{damage}', profile.damage)
  .replaceAll('{type}', blueprint.damageType)
  .replaceAll('{movement}', String(profile.movement));

const tierLoot = (pool = {}, rank = 1) => {
  const valueAt = (rarity, fallback) => (pool[rarity] && pool[rarity].length ? pool[rarity] : fallback);
  const common = valueAt('common', ['Beast Hide']);
  const uncommon = valueAt('uncommon', common);
  const rare = valueAt('rare', uncommon);
  const epic = valueAt('epic', rare);
  const legendary = valueAt('legendary', epic);
  const pick = (values, index) => values[index % values.length];
  if (rank <= 1) return [
    { itemName: pick(common, 0), itemChance: 45, quantity: '1-2', rarity: 'common' },
    { itemName: pick(common, 1), itemChance: 30, rarity: 'common' },
    { itemName: pick(uncommon, 0), itemChance: 15, rarity: 'uncommon' },
    { itemName: 'Nothing', itemChance: 10, rarity: 'common' },
  ];
  if (rank === 2) return [
    { itemName: pick(common, 0), itemChance: 30, quantity: '2-3', rarity: 'common' },
    { itemName: pick(uncommon, 0), itemChance: 32, quantity: '1-2', rarity: 'uncommon' },
    { itemName: pick(rare, 0), itemChance: 13, rarity: 'rare' },
    { itemName: 'Nothing', itemChance: 10, rarity: 'common' },
  ];
  if (rank === 3) return [
    { itemName: pick(common, 0), itemChance: 18, quantity: '3-5', rarity: 'common' },
    { itemName: pick(uncommon, 0), itemChance: 32, quantity: '2-3', rarity: 'uncommon' },
    { itemName: pick(rare, 0), itemChance: 28, quantity: '1-2', rarity: 'rare' },
    { itemName: pick(epic, 0), itemChance: 7, rarity: 'epic' },
  ];
  return [
    { itemName: pick(uncommon, 0), itemChance: 32, quantity: '3-5', rarity: 'uncommon' },
    { itemName: pick(rare, 0), itemChance: 32, quantity: '2-3', rarity: 'rare' },
    { itemName: pick(epic, 0), itemChance: 22, rarity: 'epic' },
    { itemName: pick(legendary, 0), itemChance: 6, rarity: 'legendary' },
  ];
};

const chaosName = (name) => name.endsWith(' Slime')
  ? name.replace(/ Slime$/, ' Chaos Slime')
  : `Chaos ${name}`;

const defaultTierName = (blueprint, tier) => {
  if (blueprint.tierNames?.[tier.key]) return blueprint.tierNames[tier.key];
  if (tier.chaos && !blueprint.chaosSpecies) return chaosName(blueprint.name);
  return `${tier.key} ${blueprint.name}`;
};

const defaultDescription = (blueprint, tier) => {
  if (tier.chaos) return `${defaultTierName(blueprint, tier)} is the ${blueprint.name.toLowerCase()}'s apex state: its established adaptations remain recognizable, but direct Chaos exposure makes their timing, target, and consequence unstable.`;
  const progression = tier.rank === 1 ? 'young or lightly developed' : tier.rank === 2 ? 'mature and fully adapted' : 'rare, old, and ecologically dominant';
  return `A ${progression} ${blueprint.name.toLowerCase()} shaped by ${blueprint.adaptation}.`;
};

const statsFor = (blueprint, tier, profile) => ({
  'Hit Points': String(profile.hp),
  Defence: String(profile.defence),
  Initiative: profile.initiative >= 0 ? `+${profile.initiative}` : String(profile.initiative),
  Movement: `${profile.movement} spaces`,
  Force: `+${profile.force}`,
  Finesse: `+${profile.finesse}`,
  Guard: `+${profile.guard}`,
  Focus: `+${profile.focus}`,
  Tempo: `+${profile.tempo}`,
  Resonance: `+${profile.resonance}`,
  'Attack Bonus': `+${profile.attackBonus}`,
  'Save Difficulty': String(profile.saveDifficulty),
  'Damage Type': titleCase(blueprint.damageType),
  'Threat Tier': tier.chaos ? `Chaos ${tier.rank - 3}` : String(tier.rank),
  ...(blueprint.resistances ? { Resistances: blueprint.resistances } : {}),
  ...(blueprint.vulnerabilities ? { Vulnerabilities: blueprint.vulnerabilities } : {}),
  ...(blueprint.immunities ? { Immunities: blueprint.immunities } : {}),
});

const abilitiesFor = (blueprint, tier, profile) => {
  const attack = `${blueprint.attackName}: Make an attack (${profile.attackBonus >= 0 ? '+' : ''}${profile.attackBonus}) against Defence at ${blueprint.attackRange || '1 space'}. On a hit, deal ${profile.damage} ${blueprint.damageType} damage.`;
  const unlocked = (blueprint.abilities || []).slice(0, Math.min(blueprint.abilities.length, tier.rank));
  const abilities = [attack, ...unlocked.map((ability) => render(ability, profile, blueprint)), ...(blueprint.passives || [])];
  if (tier.chaos) {
    abilities.push(`Chaos Flux: At the start of each of its turns, roll ${blueprint.chaosDie || 'd6'} and resolve the matching Chaos result. The same result can occur on consecutive turns.`);
    abilities.push('Unstable Targeting: Unless a Chaos result names its target, determine every eligible target at random, including the creature itself and its allies.');
  }
  return unique(abilities);
};

const buildTier = (blueprint, tier, legacyTier) => {
  const profile = profileFor(tier.rank, blueprint.role || 'balanced');
  const generated = {
    id: tier.key,
    Locked: Boolean(tier.rank > 1 || tier.chaos),
    Name: defaultTierName(blueprint, tier),
    Description: blueprint.descriptions?.[tier.key] || defaultDescription(blueprint, tier),
    Stats: statsFor(blueprint, tier, profile),
    SongHearing: blueprint.songHearing || 'audible',
    Abilities: abilitiesFor(blueprint, tier, profile),
    Loot: tierLoot(blueprint.loot, tier.rank),
    ...(tier.chaos ? {
      ChaosTier: true,
      ChaosTable: (blueprint.chaosEffects || []).map((effect, index) => ({ Roll: String(index + 1), Effect: render(effect, profile, blueprint) })),
    } : {}),
  };
  if (!legacyTier) return generated;
  return {
    ...legacyTier,
    ...generated,
    Description: blueprint.descriptions?.[tier.key] || legacyTier.Description || generated.Description,
    Loot: legacyTier.Loot?.length ? legacyTier.Loot : generated.Loot,
    Abilities: unique([...(legacyTier.Abilities || []), ...generated.Abilities]),
    ...(legacyTier.imageUrl ? { imageUrl: legacyTier.imageUrl } : {}),
  };
};

const createSpecies = (blueprint, legacySpecies) => {
  const tiers = blueprint.tiers || (blueprint.chaosSpecies ? CHAOS_SLIME_TIERS : DEFAULT_TIERS);
  return {
    ...(legacySpecies || {}),
    Locked: legacySpecies?.Locked ?? blueprint.locked ?? true,
    LoreLocked: legacySpecies?.LoreLocked ?? blueprint.loreLocked ?? false,
    Name: blueprint.name,
    // The expansion blueprint is sourced from the current lore and therefore
    // wins where an older placeholder contradicts it (notably Chaos Slimes).
    Lore: { ...(legacySpecies?.Lore || {}), ...(blueprint.lore || {}) },
    Tiers: Object.fromEntries(tiers.map((tier) => [tier.key, buildTier(blueprint, tier, legacySpecies?.Tiers?.[tier.key])])),
  };
};

const createCatalog = (blueprints, legacy = {}) => Object.fromEntries(blueprints.map((blueprint) => [
  blueprint.name,
  createSpecies(blueprint, legacy[blueprint.name]),
]));

module.exports = { createCatalog, createSpecies, DEFAULT_TIERS, CHAOS_SLIME_TIERS };
