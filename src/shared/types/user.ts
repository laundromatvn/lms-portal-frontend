export type User = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  verified_at: string | null;
  status: string;
  is_verified: boolean;
}
