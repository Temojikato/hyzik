export type DamageTypeCategory = 'physical' | 'elemental' | 'energetic' | 'esoteric';

export interface CombatDamageTypeDefinition {
  id: string;
  name: string;
  category: DamageTypeCategory;
  description: string;
  examples: string;
}

// This is the canonical combat vocabulary for players, abilities, equipment,
// and creatures. Matchups are intentionally not global: resistance,
// vulnerability, and immunity belong to the individual rules entry.
export const combatDamageTypes: CombatDamageTypeDefinition[] = [
  { id: 'arcane', name: 'Arcane', category: 'esoteric', description: 'Unshaped magical energy that disrupts spells, wards, and constructed enchantments.', examples: 'Runes, spell fractures, unstable magic.' },
  { id: 'blood', name: 'Blood', category: 'esoteric', description: 'Vital force weaponized through flesh, sacrifice, circulation, or sympathetic wounds.', examples: 'Hemomancy, life-drain, blood puppetry.' },
  { id: 'fire', name: 'Fire', category: 'elemental', description: 'Heat, flame, combustion, and supernatural burning.', examples: 'Flames, molten spray, cinders.' },
  { id: 'force', name: 'Force', category: 'energetic', description: 'Pure kinetic song-energy with no ordinary material form.', examples: 'Concussive blasts, pressure walls, magical impact.' },
  { id: 'frost', name: 'Frost', category: 'elemental', description: 'Cold severe enough to freeze tissue, liquids, and mechanisms.', examples: 'Ice, rime, stolen heat.' },
  { id: 'lightning', name: 'Lightning', category: 'elemental', description: 'Electrical discharge and nervous-system overload.', examples: 'Arcs, static fields, storm bolts.' },
  { id: 'metal', name: 'Metal', category: 'physical', description: 'Damage carried by magically driven metal as a substance, distinct from the shape of the wound.', examples: 'Animated blades, iron splinters, crushing machinery.' },
  { id: 'nature', name: 'Nature', category: 'esoteric', description: 'Living growth, predatory flora, spores, and primal ecological force.', examples: 'Thorns, roots, fungal blooms.' },
  { id: 'piercing', name: 'Piercing', category: 'physical', description: 'Puncturing physical trauma caused by a narrow point.', examples: 'Arrows, talons, spears.' },
  { id: 'poison', name: 'Poison', category: 'physical', description: 'Toxic damage delivered through venom, gas, contact, or corrupted metabolism.', examples: 'Venom, toxic mist, alchemical poison.' },
  { id: 'psychic', name: 'Psychic', category: 'esoteric', description: 'Direct injury to thought, perception, memory, or identity.', examples: 'Mind spikes, terror, invasive memories.' },
  { id: 'radiant', name: 'Radiant', category: 'energetic', description: 'Purifying or overwhelming luminous energy.', examples: 'Consecrated light, solar flares, cleansing beams.' },
  { id: 'shadow', name: 'Shadow', category: 'esoteric', description: 'Harm expressed through darkness, absence, fear, and stolen presence.', examples: 'Living silhouettes, night blades, draining gloom.' },
  { id: 'sonic', name: 'Sonic', category: 'energetic', description: 'Destructive vibration, resonance, pressure, and dissonance.', examples: 'Shattering notes, resonance bursts, concussive sound.' },
  { id: 'stone', name: 'Stone', category: 'physical', description: 'Earth and mineral mass driven with supernatural weight or sharpness.', examples: 'Rockfall, crystal shards, crushing earth.' },
  { id: 'void', name: 'Void', category: 'esoteric', description: 'Unmaking energy from absence, dimensional rupture, or hostile nothingness.', examples: 'Spatial tears, erasure, abyssal exposure.' },
  { id: 'wind', name: 'Wind', category: 'elemental', description: 'Cutting air, violent pressure changes, and atmospheric impact.', examples: 'Gales, air blades, pressure collapse.' },
];

export const combatDamageTypeIds = combatDamageTypes.map((entry) => entry.id);

