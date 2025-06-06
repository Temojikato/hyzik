// src/types/BestiaryTypes.ts
export interface MonsterLore {
  Habitat: string;
  Behavior: string;
  Rarity: string;
  Formation?: string;
  'Social Tendencies'?: string;
}

export interface MonsterTier {
  Abilities: string[];
  id: string;
  Name?: string; // e.g. "Minor Fire Slime"
  imageUrl?: string;
  locked?: boolean;
  Description?: string;
  Stats?: Record<string, string>; // e.g. { Strength: "10", Dexterity: "10" }
  Locked?: boolean;
  Loot?: LootEntry[];
}

export interface MonsterSpecies {
  categoryId: string;  // e.g. "Slime"
  name: string;        // e.g. "Fire Slime"
  locked?: boolean;
  loreLocked?: boolean;
  Lore?: MonsterLore;
  Tiers?: Record<string, MonsterTier>;  // "Minor" => { locked, ... }
}

export interface LootEntry {
  itemName: string;
  itemChance: number;
}
