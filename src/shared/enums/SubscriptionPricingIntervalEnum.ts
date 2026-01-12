export const SubscriptionPricingIntervalEnum = {
    MONTH: 'MONTH',
    YEAR: 'YEAR',
} as const;

export type SubscriptionPricingIntervalEnum = typeof SubscriptionPricingIntervalEnum[keyof typeof SubscriptionPricingIntervalEnum];
