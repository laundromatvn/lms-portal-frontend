import { ConditionValueTypeEnum } from '@shared/enums/ConditionValueTypeEnum';

export type PromotionCondition = {
  type: string
  operator: string
  value: any
  value_type: ConditionValueTypeEnum
  display_value?: string
};
