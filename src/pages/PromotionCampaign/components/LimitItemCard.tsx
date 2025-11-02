import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';

import { PromotionBaseCard } from './PromotionBaseCard';

interface Props {
  limit: PromotionLimit;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const LimitItemCard: React.FC<Props> = ({ limit, onEdit, onDelete }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const primaryColor = theme.custom.colors.danger.default;
  const lightColor = theme.custom.colors.danger.light;

  return (
    <PromotionBaseCard
      key={JSON.stringify(limit)}
      title={t(`promotionCampaign.limit_types.${limit.type}`)}
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
        {limit.value} {limit.unit && `(${t(`promotionCampaign.unit.${limit.unit}`)})`}
      </Typography.Text>
    </PromotionBaseCard>
  );
};

