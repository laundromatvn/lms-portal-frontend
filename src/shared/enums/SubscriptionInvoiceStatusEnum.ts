export const SubscriptionInvoiceStatusEnum = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;

export type SubscriptionInvoiceStatusEnum = typeof SubscriptionInvoiceStatusEnum[keyof typeof SubscriptionInvoiceStatusEnum];
