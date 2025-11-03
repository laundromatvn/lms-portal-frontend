import type { PromotionCondition } from "@shared/types/promotion/PromotionCondition";
import type { PromotionReward } from "@shared/types/promotion/PromotionReward";
import type { PromotionLimit } from "@shared/types/promotion/PromotionLimit";

export type PromotionMetadata = {
  conditions: PromotionCondition[];
  rewards: PromotionReward[];
  limits: PromotionLimit[];
};
