import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Tenant } from '@shared/types/tenant';

import {
  useGetAvailableSubscriptionPlanApi,
  type GetAvailableSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useGetAvailableSubscriptionPlanApi';

import { type SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { Box } from '@shared/components/Box';

interface Props {
  selectedSubscriptionPlan: SubscriptionPlan | null;
  onSelect: (subscriptionPlan: SubscriptionPlan) => void;
}

export const SelectSubscriptionPlanSection: React.FC<Props> = ({ selectedSubscriptionPlan, onSelect }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    getAvailableSubscriptionPlan,
    data: availableSubscriptionPlansData,
    loading: getAvailableSubscriptionPlanLoading,
  } = useGetAvailableSubscriptionPlanApi<GetAvailableSubscriptionPlanResponse>();

  useEffect(() => {
    getAvailableSubscriptionPlan();
  }, []);

  return (
    <BaseDetailSection
      title={t('tenant.selectSubscriptionPlan')}
      loading={getAvailableSubscriptionPlanLoading}
    >
      {availableSubscriptionPlansData?.map((subscriptionPlan) => (
        <Box
          vertical
          border
          key={subscriptionPlan.id}
          onClick={() => selectedSubscriptionPlan?.id !== subscriptionPlan.id && onSelect(subscriptionPlan)}
          style={{
            width: '100%',
            maxWidth: 600,
            padding: theme.custom.spacing.medium,
            backgroundColor: selectedSubscriptionPlan?.id === subscriptionPlan.id
              ? theme.custom.colors.primary.light
              : theme.custom.colors.background.light,
          }}
        >
          <Typography.Text strong>{subscriptionPlan.name}</Typography.Text>

          <Typography.Paragraph
            type='secondary'
            ellipsis={{
              rows: 2,
              expandable: true,
              symbol: 'more',
            }}
          >
            {subscriptionPlan.description}
          </Typography.Paragraph>
        </Box>
      ))}
    </BaseDetailSection>
  );
};
2