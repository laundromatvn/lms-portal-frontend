import { SubscriptionInvoiceStatusEnum } from '@shared/enums/SubscriptionInvoiceStatusEnum';

export type SubscriptionInvoice = {
  id: string
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  code: string
  status: SubscriptionInvoiceStatusEnum
  subscription_plan_id: string | null
  subscription_plan_name: string | null
  invoice_period_start_date: string
  invoice_period_end_date: string | null
  billing_type: string
  pricing_unit: string
  billing_interval: string | null
  interval_count: number | null
  base_unit_price: number
  trial_period_days: number
  billing_unit_count: number
  base_amount: number
  discount_amount: number
  final_amount: number
  tenant_id: string | null
  tenant_name: string | null
}
