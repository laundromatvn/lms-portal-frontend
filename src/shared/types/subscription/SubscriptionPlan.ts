import type { SubscriptionPricingOption } from './SubscriptionPricingOption';

export type SubscriptionPlan = {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by: string | null
  updated_by: string | null
  deleted_by: string | null
  name: string
  description: string | null
  is_enabled: boolean | null
  is_default: boolean | null
  permission_group: {
    id: string
    name: string
  } | null
  pricing_options: SubscriptionPricingOption[]
}
