import type { TFunction } from "i18next";

import { ConditionValueTypeEnum } from "@shared/enums/ConditionValueTypeEnum";
import { type PromotionCondition } from "@shared/types/promotion/PromotionCondition";
import type { PromotionMetadataConditionOption } from "@shared/types/promotion/PromotionMetadata";

export const buildConditionDescription = (condition: PromotionCondition, t: TFunction) => {
  if (!condition) return '';

  switch (condition.type) {
    case ConditionValueTypeEnum.NUMBER:
      return `${t(`promotionCampaign.operator.${condition.operator}`)} ${condition.display_value || condition.value}`;
    case ConditionValueTypeEnum.STRING:
      return `${t(`promotionCampaign.operator.${condition.operator}`)} ${condition.display_value || condition.value}`;
    case ConditionValueTypeEnum.OPTIONS:
      return `${t(`promotionCampaign.operator.${condition.operator}`)} ${condition.display_value || condition.value.join(', ')}`;
    default:
      return `${t(`promotionCampaign.operator.${condition.operator}`)} ${condition.display_value || condition.value}`;
  }
};

export const buildDisplayValue = (conditionOption: PromotionMetadataConditionOption, value: any) => {
  switch (conditionOption.value_type) {
    case ConditionValueTypeEnum.NUMBER:
      return String(value);
    case ConditionValueTypeEnum.STRING:
      return String(value);
    case ConditionValueTypeEnum.OPTIONS:
      const selectedOptions = conditionOption.options.filter((option) => value.includes(option.value));
      return selectedOptions.map((option) => option.label).join(', ');
    default:
      return String(value);
  }
};
