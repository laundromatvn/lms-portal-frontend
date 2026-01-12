import React from 'react';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';

import { BasicInformationSection } from './BasicInformationSection';
import { PricingOptionsSection } from './PricingOptionSection';

interface Props {
  subscriptionPlan: SubscriptionPlan | null;
  loading?: boolean;
  onRefresh?: () => void;
}

export const BasicInformationTab: React.FC<Props> = ({ subscriptionPlan, loading, onRefresh }) => {
  const theme = useTheme();

  return (
    <Flex vertical gap={theme.custom.spacing.medium}>
      <BasicInformationSection subscriptionPlan={subscriptionPlan} loading={loading} />
      <PricingOptionsSection subscriptionPlan={subscriptionPlan} loading={loading} onRefresh={onRefresh} />
    </Flex>
  );
};
