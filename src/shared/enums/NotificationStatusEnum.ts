export const NotificationStatusEnum = {
  NEW: 'NEW',
  DELIVERED: 'DELIVERED',
  SEEN: 'SEEN',
  FAILED: 'FAILED',
} as const;

export type NotificationStatusEnum = typeof NotificationStatusEnum[keyof typeof NotificationStatusEnum];
