import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Typography, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import {
  useGetAvailableSubscriptionPlanApi,
  type GetAvailableSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useGetAvailableSubscriptionPlanApi';
import {
  useGetTenantActiveSubscriptionPlanApi,
  type GetTenantActiveSubscriptionPlanResponse,
} from '@shared/hooks/tenant/useGetTenantActiveSubscriptionPlanApi';

import { type SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { SubscriptionPlanSelectItem } from '../components/SubscriptionPlanSelectItem';

interface Props {
  tenantId: string;
  onSelectPlan: (subscriptionPlanId: string) => void;
}

export const SelectSubscriptionPlanStep: React.FC<Props> = ({
  tenantId,
  onSelectPlan,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [api, contextHolder] = notification.useNotification();

  const {
    getAvailableSubscriptionPlan,
    data: availableSubscriptionPlans,
    loading: getAvailableSubscriptionPlanLoading,
  } = useGetAvailableSubscriptionPlanApi<GetAvailableSubscriptionPlanResponse>();

  const {
    getTenantActiveSubscriptionPlan,
    data: tenantActiveSubscriptionPlan,
  } = useGetTenantActiveSubscriptionPlanApi<GetTenantActiveSubscriptionPlanResponse>();

  const handleSelectPlan = (subscriptionPlan: SubscriptionPlan) => {
    if (tenantActiveSubscriptionPlan?.subscription_plan?.id === subscriptionPlan.id) {
      api.error({
        message: t('subscription.messages.youAreAlreadyUsingThisSubscriptionPlan'),
      });
      return;
    }

    onSelectPlan(subscriptionPlan.id);
  };

  useEffect(() => {
    getAvailableSubscriptionPlan();
    getTenantActiveSubscriptionPlan(tenantId);
  }, [tenantId]);

  return (
    <BaseDetailSection
      title={t('subscription.selectSubscriptionPlan')}
      onRefresh={getAvailableSubscriptionPlan}
      loading={getAvailableSubscriptionPlanLoading}
    >
      {contextHolder}

      <Typography.Text type="secondary">
        {t('subscription.upgradeSubscriptionPlanDescription')}
      </Typography.Text>

      <Flex
        vertical={isMobile}
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', overflowX: 'auto' }}
      >
        {availableSubscriptionPlans?.map((subscriptionPlan, index) => (
          <SubscriptionPlanSelectItem
            key={subscriptionPlan.id}
            index={index}
            isCurrent={
              tenantActiveSubscriptionPlan?.subscription_plan?.id ===
              subscriptionPlan.id
            }
            subscriptionPlan={subscriptionPlan}
            onSelect={handleSelectPlan}
          />
        ))}
      </Flex>
    </BaseDetailSection>
  );
};
