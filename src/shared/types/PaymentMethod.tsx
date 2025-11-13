import { PaymentMethodEnum } from "@shared/enums/PaymentMethodEnum";
import { PaymentProviderEnum } from "@shared/enums/PaymentProviderEnum";

export type QRPaymentMethodDetail = {
  bank_code: string;
  bank_name: string | null;
  bank_account_number: string;
  bank_account_name: string;
};

export type CardVNPAYPaymentMethodDetail = {
  merchant_code: string;
  terminal_code: string;
  init_secret_key: string;
  query_secret_key: string;
  ipnv3_secret_key: string;
};

export type PaymentMethod = {
  payment_method: PaymentMethodEnum;
  payment_provider: PaymentProviderEnum;
  details: QRPaymentMethodDetail | CardVNPAYPaymentMethodDetail;
};
