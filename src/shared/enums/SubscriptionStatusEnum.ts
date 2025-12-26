export const SubscriptionStatusEnum = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  PAST_DUE: 'PAST_DUE',
  EXPIRED: 'EXPIRED',
} as const;

export type SubscriptionStatusEnum = typeof SubscriptionStatusEnum[keyof typeof SubscriptionStatusEnum];
