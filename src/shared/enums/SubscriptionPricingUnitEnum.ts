export const SubscriptionPricingUnitEnum = {
    PLAN: 'PLAN',
    STORE: 'STORE',
    MACHINE: 'MACHINE',
} as const;

export type SubscriptionPricingUnitEnum = typeof SubscriptionPricingUnitEnum[keyof typeof SubscriptionPricingUnitEnum];
