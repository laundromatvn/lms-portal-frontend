import { MachineTypeEnum } from "@shared/enums/MachineTypeEnum";

export type Machine = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  controller_id: string;
  controller_device_id: string | null;
  relay_no: number;
  name: string;
  machine_type: MachineTypeEnum;
  details: Record<string, any>;
  base_price: string;
  status: string;
  store_id: string | null;
  store_name: string | null;
}
