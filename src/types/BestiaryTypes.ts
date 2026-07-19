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
  /** Whether this creature can be affected by audible Song Magic. */
  SongHearing?: 'audible' | 'soundless';
  /** Repeatable creature populations reserve this flag for their apex Chaos state. */
  ChaosTier?: boolean;
  /** Explicit combat RNG for a Chaos state; roll once at the start of its turn. */
  ChaosTable?: Array<{ Roll: string; Effect: string }>;
}

export interface MonsterSpecies {
  categoryId: string;  // e.g. "Slime"
  name: string;        // e.g. "Fire Slime"
  locked?: boolean;
  loreLocked?: boolean;
  discoveryManaged?: boolean;
  loreUnlockCount?: number;
  encounterCount?: number;
  Lore?: MonsterLore;
  Tiers?: Record<string, MonsterTier>;  // "Minor" => { locked, ... }
}

export interface LootEntry {
  itemName: string;
  itemChance: number;
  quantity?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'artifact';
}
