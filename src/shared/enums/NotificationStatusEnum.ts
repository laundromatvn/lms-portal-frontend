export const NotificationStatusEnum = {
  NEW: 'NEW',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
  FAILED: 'FAILED',
} as const;

export type NotificationStatusEnum = typeof NotificationStatusEnum[keyof typeof NotificationStatusEnum];
