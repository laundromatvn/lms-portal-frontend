export const SubscriptionPricingBillingTypEnum = {
    RECURRING: 'RECURRING',
    ONE_TIME: 'ONE_TIME',
} as const;

export type SubscriptionPricingBillingTypEnum = typeof SubscriptionPricingBillingTypEnum[keyof typeof SubscriptionPricingBillingTypEnum];
