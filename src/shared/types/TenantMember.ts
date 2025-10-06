export type TenantMember = {
  id: string
  tenant_id: string
  user_id: string
  is_enabled: boolean
  tenant_name: string
  user_email: string | null
  user_phone: string | null
  user_role: string
  user_status: string
}
