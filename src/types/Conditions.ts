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
  type: string;
  color: string;
}

export interface UserCondition {
  type: string;
  amount: number;
  name: string;
  color?: string;
}
