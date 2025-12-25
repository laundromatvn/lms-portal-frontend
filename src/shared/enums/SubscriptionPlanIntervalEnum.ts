export const SubscriptionPlanIntervalEnum = {
  MONTH: 'MONTH',
  YEAR: 'YEAR',
} as const;

export type SubscriptionPlanIntervalEnum = typeof SubscriptionPlanIntervalEnum[keyof typeof SubscriptionPlanIntervalEnum];
