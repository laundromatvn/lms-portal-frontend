export const PromotionCampaignStatusEnum = {
  DRAFT: "DRAFT",
  SCHEDULED: "SCHEDULED",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  INACTIVE: "INACTIVE",
  FINISHED: "FINISHED",
  } as const;
  
  export type PromotionCampaignStatusEnum = typeof PromotionCampaignStatusEnum[keyof typeof PromotionCampaignStatusEnum];
  