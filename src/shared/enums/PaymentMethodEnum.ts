export const PaymentMethodEnum = {
  QR: 'QR',
  CARD: 'CARD',
} as const;

export type PaymentMethodEnum = typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];
