export const TenantStatusEnum = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type TenantStatusEnum = typeof TenantStatusEnum[keyof typeof TenantStatusEnum];
