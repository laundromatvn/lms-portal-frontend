import { OrderStatusEnum } from "@shared/enums/OrderStatusEnum";
import { PaymentStatusEnum } from "@shared/enums/PaymentStatusEnum";

export type OverviewOrder = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
  total_amount: number;
  total_washer: number;
  total_dryer: number;
  status: OrderStatusEnum;
  payment_status: PaymentStatusEnum;
  transaction_code: string;
}
