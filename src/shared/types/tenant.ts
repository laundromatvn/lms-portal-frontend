export type Tenant = {
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string | null;
  deleted_by: string | null;
  status: string;
  name: string;
  contact_email: string;
  contact_phone_number: string;
  contact_full_name: string;
  contact_address: string;
}
