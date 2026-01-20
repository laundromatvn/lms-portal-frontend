export const NotificationTypeEnum = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
} as const;

export type NotificationTypeEnum = typeof NotificationTypeEnum[keyof typeof NotificationTypeEnum];
