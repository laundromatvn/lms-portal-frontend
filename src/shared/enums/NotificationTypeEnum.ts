export const NotificationTypeEnum = {
  INFO: 'INFO',
  ERROR: 'ERROR',
} as const;

export type NotificationTypeEnum = typeof NotificationTypeEnum[keyof typeof NotificationTypeEnum];
