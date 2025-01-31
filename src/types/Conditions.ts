// src/types/Conditions.ts
export interface ConditionEffect {
  name: string;
  effect: string;
  img?: string;
}

export interface ConditionDefinition {
  name: string;
  thresholds: number[];
  conditionEffects: ConditionEffect[];
}

export interface UserCondition {
  amount: number;
  name: string;
  color?: string;
}
