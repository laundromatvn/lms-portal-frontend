export const PaymentProviderEnum = {
  VIET_QR: 'VIET_QR',
  VNPAY: 'VNPAY',
  INTERNAL_PROMOTION: 'INTERNAL_PROMOTION',
} as const;

export type PaymentProviderEnum = typeof PaymentProviderEnum[keyof typeof PaymentProviderEnum];
