export const PaymentStatusEnum = {
  NEW: "NEW",
  WAITING_FOR_PAYMENT_DETAIL: "WAITING_FOR_PAYMENT_DETAIL",
  WAITING_FOR_PURCHASE: "WAITING_FOR_PURCHASE",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;

export type PaymentStatusEnum = typeof PaymentStatusEnum[keyof typeof PaymentStatusEnum];
