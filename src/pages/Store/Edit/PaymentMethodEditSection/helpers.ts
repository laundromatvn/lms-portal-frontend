import { PaymentMethodEnum } from '@shared/enums/PaymentMethodEnum';
import { PaymentProviderEnum } from '@shared/enums/PaymentProviderEnum';
import type { PaymentMethod } from '@shared/types/PaymentMethod';

export const buildPaymentMethodDetails = (
  paymentMethod: PaymentMethodEnum,
  paymentProvider: PaymentProviderEnum,
  values: any
): PaymentMethod | null => {
  if (paymentMethod === PaymentMethodEnum.QR && paymentProvider === PaymentProviderEnum.VIET_QR) {
    return buildVietQRPaymentMethodDetails(values);
  }

  if (paymentMethod === PaymentMethodEnum.QR && paymentProvider === PaymentProviderEnum.VNPAY) {
    return buildVNPAYQRPaymentMethodDetails(values);
  }

  else if (paymentMethod === PaymentMethodEnum.CARD && paymentProvider === PaymentProviderEnum.VNPAY) {
    return buildVNPAYPaymentMethodDetails(values);
  }

  return null;
};

const buildVietQRPaymentMethodDetails = (values: any) => {
  const bankCode = values.bank_code;
  const bankName = values.bank_name;
  const bankAccountNumber = values.bank_account_number;
  const bankAccountName = values.bank_account_name;

  return {
    payment_method: PaymentMethodEnum.QR,
    payment_provider: PaymentProviderEnum.VIET_QR,
    is_enabled: values.is_enabled,
    details: {
      bank_code: bankCode,
      bank_name: bankName,
      bank_account_number: bankAccountNumber,
      bank_account_name: bankAccountName,
    },
  };
};

const buildVNPAYPaymentMethodDetails = (values: any) => {
  const merchantCode = values.merchant_code;
  const terminalCode = values.terminal_code;
  const initSecretKey = values.init_secret_key;
  const querySecretKey = values.query_secret_key;
  const ipnv3SecretKey = values.ipnv3_secret_key;

  return {
    payment_method: PaymentMethodEnum.CARD,
    payment_provider: PaymentProviderEnum.VNPAY,
    is_enabled: values.is_enabled,
    details: {
      merchant_code: merchantCode,
      terminal_code: terminalCode,
      init_secret_key: initSecretKey,
      query_secret_key: querySecretKey,
      ipnv3_secret_key: ipnv3SecretKey,
    },
  };
};

const buildVNPAYQRPaymentMethodDetails = (values: any) => {
  const merchantCode = values.merchant_code;
  const terminalCode = values.terminal_code;
  const initSecretKey = values.init_secret_key;
  const querySecretKey = values.query_secret_key;
  const ipnv3SecretKey = values.ipnv3_secret_key;

  return {
    payment_method: PaymentMethodEnum.QR,
    payment_provider: PaymentProviderEnum.VNPAY,
    is_enabled: values.is_enabled,
    details: {
      merchant_code: merchantCode,
      terminal_code: terminalCode,
      init_secret_key: initSecretKey,
      query_secret_key: querySecretKey,
      ipnv3_secret_key: ipnv3SecretKey,
    },
  };
};
