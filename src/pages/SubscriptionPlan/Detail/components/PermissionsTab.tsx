import React from 'react';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';

import { PermissionGroupSection } from './PermissionGroupSection';
import { PermissionsSection } from './PermissionsSection';

interface Props {
  subscriptionPlan: SubscriptionPlan | null;
  loading?: boolean;
}

export const PermissionsTab: React.FC<Props> = ({ subscriptionPlan, loading }) => {
  const theme = useTheme();

  return (
    <Flex vertical gap={theme.custom.spacing.medium}>
      <PermissionGroupSection
        subscriptionPlan={subscriptionPlan}
        loading={loading}
      />

      <PermissionsSection
        subscriptionPlan={subscriptionPlan}
        loading={loading}
      />
    </Flex>
  );
};
