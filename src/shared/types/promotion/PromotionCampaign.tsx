import type { PromotionCampaignStatusEnum } from "@shared/enums/PromotionCampaignStatusEnum";

import type { PromotionCondition } from "@shared/types/promotion/PromotionCondition";
import type { PromotionReward } from "@shared/types/promotion/PromotionReward";
import type { PromotionLimit } from "@shared/types/promotion/PromotionLimit";

export type PromotionCampaign = {
    id: string
    created_at: string
    updated_at: string
    deleted_at: string | null
    created_by: string | null
    updated_by: string | null
    deleted_by: string | null
    name: string
    description: string | null
    status: PromotionCampaignStatusEnum
    tenant_id: string | null
    start_time: string
    end_time: string | null
    conditions: PromotionCondition[]
    rewards: PromotionReward[]
    limits: PromotionLimit[]
};
