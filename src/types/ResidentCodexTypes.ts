export interface NPCBasicInfo {
  name: string;
  age: string;
  residence: string;
  workplace: string;
  family: string[];
}

export interface NPCCategories {
  families: string[];
  workplace: string[];
  faction: string[];
  // Additional category modes can be added here
}

export interface NPCCategoryLocks {
  families?: boolean;    // true = locked for display under families
  workplace?: boolean;   // true = locked for display under workplace
  faction?: boolean;     // true = locked for display under faction
}

export interface NPCLoreFieldLevels {
  title: string;
  unlockedtier: number; // Levels above this number should be locked
  level1: string;
  level2?: string;
  level3?: string;
  level4?: string; // Extend as needed
}

export interface NPCLore {
  ideologies: NPCLoreFieldLevels;
  friendsAndFoes: NPCLoreFieldLevels;
  towerExperience: NPCLoreFieldLevels;
  personalHistory?: NPCLoreFieldLevels;
  personality?: NPCLoreFieldLevels;
  goals?: NPCLoreFieldLevels;
  // Add additional lore categories as needed
}
export interface NPCImageFile {
  filename: string;
  locked?: boolean;
}

export interface NPC {
  id: string;
  imageUrl: string;
  basicInfo: NPCBasicInfo;
  categories: NPCCategories;
  lore?: NPCLore;
  locked?: boolean; // Overall NPC lock flag, if needed
  categoryLocks?: NPCCategoryLocks; // Lock per category (e.g., faction, families, workplace)
  imageFiles?: NPCImageFile[];
}