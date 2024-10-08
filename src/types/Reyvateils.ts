import { DocumentReference } from "firebase/firestore";

export interface Ability {
  name: string;
  description: string;
  cooldown: number; // in seconds
  icon: string; // URL or local path to the icon image
  lastUsed?: Date | null;
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
