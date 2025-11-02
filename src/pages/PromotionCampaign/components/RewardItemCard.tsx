import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionReward } from '@shared/types/promotion/PromotionReward';

import { PromotionBaseCard } from './PromotionBaseCard';

interface Props {
  reward: PromotionReward;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const RewardItemCard: React.FC<Props> = ({ reward, onEdit, onDelete }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const primaryColor = theme.custom.colors.success.default;
  const lightColor = theme.custom.colors.success.light;

  return (
    <PromotionBaseCard
      key={JSON.stringify(reward)}
      title={t(`promotionCampaign.reward_types.${reward.type}`)}
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
        {reward.value} {reward.unit && `(${t(`promotionCampaign.unit.${reward.unit}`)})`}
      </Typography.Text>
    </PromotionBaseCard>
  );
};

