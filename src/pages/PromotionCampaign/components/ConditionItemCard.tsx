import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';

import { PromotionBaseCard } from './PromotionBaseCard';

interface Props {
  condition: PromotionCondition;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ConditionItemCard: React.FC<Props> = ({ condition, onEdit, onDelete }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const primaryColor = theme.custom.colors.info.default;
  const lightColor = theme.custom.colors.info.light;

  return (
    <PromotionBaseCard
      key={JSON.stringify(condition)}
      title={t(`promotionCampaign.condition_types.${condition.type}`)}
      onEdit={onEdit}
      onDelete={onDelete}
      style={{
        backgroundColor: lightColor,
        color: primaryColor,
        borderColor: primaryColor,
        borderLeft: `4px solid ${primaryColor}`,
      }}
    >
      <Typography.Text>
        {t(`promotionCampaign.operator.${condition.operator}`)} {condition.value}
      </Typography.Text>
    </PromotionBaseCard>
  );
};

