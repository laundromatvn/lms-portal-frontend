import React from 'react';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';

import { BasicInformationSection } from './BasicInformationSection';
import { PricingConfigurationSection } from './PricingConfigurationSection';

interface Props {
  subscriptionPlan: SubscriptionPlan | null;
  loading?: boolean;
}

export const BasicInformationTab: React.FC<Props> = ({ subscriptionPlan, loading }) => {
  const theme = useTheme();

  return (
    <Flex vertical gap={theme.custom.spacing.medium}>
      <BasicInformationSection subscriptionPlan={subscriptionPlan} loading={loading} />
      <PricingConfigurationSection subscriptionPlan={subscriptionPlan} loading={loading} />
    </Flex>
  );
};
