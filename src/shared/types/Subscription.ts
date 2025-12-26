import { type SubscriptionPlan } from './SubscriptionPlan';
import { SubscriptionStatusEnum } from '@shared/enums/SubscriptionStatusEnum';

export type Subscription = {
    id: string
    created_at: string
    updated_at: string
    deleted_at: string | null
    created_by: string | null
    updated_by: string | null
    deleted_by: string | null
    status: SubscriptionStatusEnum
    start_date: string
    end_date: string | null
    trial_end_date: string | null
    next_renewal_date: string | null
    tenant_id: string | null
    tenant_name: string | null
    subscription_plan_id: string | null
    subscription_plan: SubscriptionPlan | null
}
