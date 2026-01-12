import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';
import { SubscriptionPricingUnitEnum } from '@shared/enums/SubscriptionPricingUnitEnum';
import { SubscriptionPricingIntervalEnum } from '@shared/enums/SubscriptionPricingIntervalEnum';

export type SubscriptionPricingOption = {
    id?: string | null;
    is_enabled: boolean;
    is_default: boolean;
    billing_type: SubscriptionPricingBillingTypEnum;
    pricing_unit: SubscriptionPricingUnitEnum;
    billing_interval: SubscriptionPricingIntervalEnum | undefined;
    interval_count: number | undefined;
    base_unit_price: number;
    trial_period_days: number;
}
