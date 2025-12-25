export type PermissionGroup = {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  name: string;
  description: string;
  is_enabled: boolean;
  tenant_id: string;
  tenant_name: string | null;
}
