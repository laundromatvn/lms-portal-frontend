export const ConditionValueTypeEnum = {
  OPTIONS: 'OPTIONS',
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  TIME_IN_DAY: 'TIME_IN_DAY',
} as const;

export type ConditionValueTypeEnum = typeof ConditionValueTypeEnum[keyof typeof ConditionValueTypeEnum];