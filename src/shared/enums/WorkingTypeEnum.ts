export const WorkingTypeEnum = {
  WASH: 'WASH',
  DRY: 'DRY',
} as const;

export type WorkingTypeEnum = typeof WorkingTypeEnum[keyof typeof WorkingTypeEnum];
