export type Controller = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status: string;
  device_id: string;
  name: string | null;
  total_relays: number;
  store_id: string | null;
  store_name: string | null;
  firmware_id: string | null;
  firmware_name: string | null;
  firmware_version: string | null;
}