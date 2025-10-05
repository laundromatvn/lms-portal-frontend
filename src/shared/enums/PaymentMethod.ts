export const PaymentMethodEnum = {
  QR: 'QR',
} as const;

export type PaymentMethodEnum = typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];
