import { type SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';
import { type Subscription } from '@shared/types/subscription/Subscription';
import { type SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';

export type CurrentTenantSubscription = {
    subscription_plan: SubscriptionPlan
    subscription: Subscription
    pricing_options: SubscriptionPricingOption[]
}
