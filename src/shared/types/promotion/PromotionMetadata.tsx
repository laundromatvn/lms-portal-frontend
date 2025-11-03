import { type ConditionValueTypeEnum } from '@shared/enums/ConditionValueTypeEnum';

export type PromotionMetadataConditionOption = {
  condition_type: string;
  operators: any[];
  options: any[];
  value_type: ConditionValueTypeEnum;
};

export type PromotionMetadataRewardOption = {
  reward_type: string;
  units: any[];
};

export type PromotionMetadataLimitOption = {
  limit_type: string;
  units: any[];
};

export type PromotionMetadata = {
  conditions: PromotionMetadataConditionOption[];
  rewards: PromotionMetadataRewardOption[];
  limits: PromotionMetadataLimitOption[];
};
