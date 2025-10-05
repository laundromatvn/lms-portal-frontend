import { PaymentMethodEnum } from "@shared/enums/PaymentMethod";

export type PaymentMethodDetail = {
  bank_code: string;
  bank_name: string | null;
  bank_account_number: string;
  bank_account_name: string;
};

export type PaymentMethod = {
  payment_method: PaymentMethodEnum;
  details: PaymentMethodDetail;
};
