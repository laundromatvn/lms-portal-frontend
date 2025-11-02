import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import { Gift } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionReward } from '@shared/types/promotion/PromotionReward';

import { PromotionBaseHeader } from '../components/PromotionBaseHeader';
import { RewardItemCard } from '../components/RewardItemCard';

interface Props {
  rewards: PromotionReward[];
}

export const RewardDetailSection: React.FC<Props> = ({ rewards }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const primaryColor = theme.custom.colors.success.default;

  return (
    <Flex vertical gap={theme.custom.spacing.small} style={{ width: '100%' }}>
      <PromotionBaseHeader
        title={t('common.rewards')}
        icon={<Gift weight='BoldDuotone' size={24} color={primaryColor} />}
        style={{ marginBottom: theme.custom.spacing.small }}
      />

      {rewards.map((reward, index) => (
        <RewardItemCard key={index} reward={reward} />
      ))}
    </Flex>
  );
};
