export const OrderStatusEnum = {
  NEW: "NEW",
  CANCELLED: "CANCELLED",
  WAITING_FOR_PAYMENT: "WAITING_FOR_PAYMENT",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  IN_PROGRESS: "IN_PROGRESS",
  FINISHED: "FINISHED",
} as const;

export type OrderStatusEnum = typeof OrderStatusEnum[keyof typeof OrderStatusEnum];
