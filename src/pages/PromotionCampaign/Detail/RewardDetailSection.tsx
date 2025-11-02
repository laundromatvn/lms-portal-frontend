import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, Typography } from 'antd';

import { Gift } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionReward } from '@shared/types/promotion/PromotionReward';

import { PromotionBaseHeader } from './components/PromotionBaseHeader';
import { PromotionBaseCard } from './components/PromotionBaseCard';

interface Props {
  rewards: PromotionReward[];
}

export const RewardDetailSection: React.FC<Props> = ({ rewards }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const primaryColor = theme.custom.colors.success.default;
  const lightColor = theme.custom.colors.success.light;

  return (
    <Flex vertical gap={theme.custom.spacing.small} style={{ width: '100%' }}>
      <PromotionBaseHeader
        title={t('common.rewards')}
        icon={<Gift weight='BoldDuotone' size={24} color={primaryColor} />}
        style={{ marginBottom: theme.custom.spacing.small }}
      />

      {rewards.map((reward) => (
        <PromotionBaseCard
          title={t(`promotionCampaign.reward_types.${reward.type}`)}
          onEdit={() => {}}
          onDelete={() => {}}
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
      ))}
    </Flex>
  );
};
