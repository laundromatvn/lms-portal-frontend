export const SubscriptionPricingUnitEnum = {
    PLAN: 'PLAN',
    MACHINE: 'MACHINE',
} as const;

export type SubscriptionPricingUnitEnum = typeof SubscriptionPricingUnitEnum[keyof typeof SubscriptionPricingUnitEnum];
