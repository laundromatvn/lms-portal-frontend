export const UserRoleEnum = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  TENANT_ADMIN: 'TENANT_ADMIN',
  TENANT_STAFF: 'TENANT_STAFF',
} as const;

export type UserRoleEnum = typeof UserRoleEnum[keyof typeof UserRoleEnum];
