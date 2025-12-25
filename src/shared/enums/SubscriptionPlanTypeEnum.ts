export const SubscriptionPlanTypeEnum = {
  RECURRING: 'RECURRING',
  ONE_TIME: 'ONE_TIME',
} as const;

export type SubscriptionPlanTypeEnum = typeof SubscriptionPlanTypeEnum[keyof typeof SubscriptionPlanTypeEnum];
