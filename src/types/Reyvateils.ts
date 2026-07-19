import { DocumentReference } from "firebase/firestore";

export interface Ability {
  id?: string;
  name: string;
  description: string;
  cooldown: number; // in seconds
  icon: string; // URL or local path to the icon image
  lastUsed?: Date | null;
  hymmnos?: {
    headword: string;
    pronunciation?: string;
    cypherId?: string;
    lexiconEntryId?: string;
    audioUrl?: string;
  };
}

export type CombatAptitudeKey = 'force' | 'finesse' | 'guard' | 'resonance' | 'focus' | 'tempo';
export type CombatActionType = 'action' | 'quick' | 'reaction' | 'passive';
export type CombatAbilityReset = 'turn' | 'round' | 'encounter' | 'passive';

export interface CombatAbility {
  id: string;
  name: string;
  description: string;
  actionType: CombatActionType;
  reset: CombatAbilityReset;
  uses: number;
  range: number;
  damageType: string;
  tags: string[];
  icon?: string;
  hymmnos?: Ability['hymmnos'];
}

export interface ReyvateilCombatProfile {
  id: string;
  specialtyTitle: string;
  role: string;
  damageType: string;
  aptitudes: Record<CombatAptitudeKey, number>;
  derived: {
    maxHp: number;
    defense: number;
    initiative: number;
    techniqueAttack: number;
    songAttack: number;
    saveDifficulty: number;
    movement: number;
  };
  growth: {
    hitPointsPerLevel: number;
    aptitudeIncreaseLevels: number[];
    newTechniqueLevels: number[];
    evolutionLevel: number;
    aptitudeCap: number;
  };
  combatAbilities: CombatAbility[];
  socialAbilities: Ability[];
}


export interface EvolutionOption {
  name: string;
  features: string;
  enhancedAbilities: Ability[];
  recipe: string;
  upgradeRequirements: {
    components: Item[];
    ritual: string;
    chanceOfFailure: number; // percentage
    failureOutcome: string;
  };
}

export interface Reyvateil {
  id: string;
  name: string;
  class: string;
  features?: string;
  stats?: {
    acrobatics?: number;
    athletics?: number;
    sleightOfHand?: number;
    stealth?: number;
    arcana?: number;
    history?: number;
    investigation?: number;
    nature?: number;
    religion?: number;
    animalHandling?: number;
    insight?: number;
    medicine?: number;
    perception?: number;
    survival?: number;
    deception?: number;
    intimidation?: number;
    performance?: number;
    persuasion?: number;
  };
  abilities: Ability[];
  combat?: ReyvateilCombatProfile;
  levelUpRequirements: UpgradeRequirement[];
  evolutionOptions: EvolutionOption[];
  image?: string; // URL or local path to the image
  images?: string[]; // URL or local path to the image
}

export interface Item {
  id: string;
  name: string;
  quantity?: number;
  description: string; // Placeholder for item descriptions
  category: string;
  recipe: { itemId: string; quantity: number }[];
}

export interface DBItem {
  reference: DocumentReference;
  quantity: number;
  id: string;
}

export interface UpgradeRequirement {
  level?: number;
  components?: Item[];
  ritual?: string;
  chanceOfFailure?: number;
  failureOutcome?: string;
}
