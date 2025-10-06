export const UserStatusEnum = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type UserStatusEnum = typeof UserStatusEnum[keyof typeof UserStatusEnum];
