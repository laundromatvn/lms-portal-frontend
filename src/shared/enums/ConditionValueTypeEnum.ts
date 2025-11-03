export const ConditionValueTypeEnum = {
  OPTIONS: 'OPTIONS',
  NUMBER: 'NUMBER',
  STRING: 'STRING',
} as const;

export type ConditionValueTypeEnum = typeof ConditionValueTypeEnum[keyof typeof ConditionValueTypeEnum];