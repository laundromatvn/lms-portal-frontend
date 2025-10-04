export const StoreStatusEnum = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type StoreStatusEnum = typeof StoreStatusEnum[keyof typeof StoreStatusEnum];
