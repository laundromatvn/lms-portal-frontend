import { MachineTypeEnum } from "@shared/enums/MachineTypeEnum";

import { type AddOn } from "./AddOn";

export type OrderDetail = {
  id: string
  created_at: string
  updated_at: string
  status: string
  machine_id: string
  order_id: string
  add_ons: AddOn[]
  price: string
  machine_name: string | null
  machine_type: MachineTypeEnum | null
}
