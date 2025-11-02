export const PromotionDetailTypeEnum = {
  CONDITIONS: 'CONDITIONS',
  REWARDS: 'REWARDS',
  LIMITS: 'LIMITS',
} as const;

export type PromotionDetailTypeEnum = typeof PromotionDetailTypeEnum[keyof typeof PromotionDetailTypeEnum];
