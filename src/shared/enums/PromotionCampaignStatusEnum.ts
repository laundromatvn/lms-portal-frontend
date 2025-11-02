export const PromotionCampaignStatusEnum = {
  DRAFT: "DRAFT",
  SCHEDULED: "SCHEDULED",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  INACTIVE: "INACTIVE",
  } as const;
  
  export type PromotionCampaignStatusEnum = typeof PromotionCampaignStatusEnum[keyof typeof PromotionCampaignStatusEnum];
  