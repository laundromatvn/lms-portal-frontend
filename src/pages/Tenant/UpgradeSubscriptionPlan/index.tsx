import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Flex,
  Typography,
  notification,
} from 'antd';

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
import {
  useCreateTenantSubscriptionPlanApi,
  type CreateTenantSubscriptionPlanResponse,
} from '@shared/hooks/tenant/useCreateTenantSubscriptionPlanApi';

import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { UpgradeSubscriptionPlanItem } from './Item';

export const UpgradeSubscriptionPlanPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const tenantId = useParams().id as string;

  const [api, contextHolder] = notification.useNotification();

  const {
    getAvailableSubscriptionPlan,
    data: availableSubscriptionPlans,
  } = useGetAvailableSubscriptionPlanApi<GetAvailableSubscriptionPlanResponse>();
  const {
    getTenantActiveSubscriptionPlan,
    data: tenantActiveSubscriptionPlan,
  } = useGetTenantActiveSubscriptionPlanApi<GetTenantActiveSubscriptionPlanResponse>();
  const {
    createTenantSubscriptionPlan,
    data: createTenantSubscriptionPlanData,
    loading: createTenantSubscriptionPlanLoading,
    error: createTenantSubscriptionPlanError,
  } = useCreateTenantSubscriptionPlanApi<CreateTenantSubscriptionPlanResponse>();

  const handleUpgradeSubscriptionPlan = (subscriptionPlan: SubscriptionPlan) => {
    if (tenantActiveSubscriptionPlan?.id === subscriptionPlan.id) {
      api.error({
        message: t('subscriptionPlan.messages.youAreAlreadyUsingThisSubscriptionPlan'),
      });

      return;
    }

    createTenantSubscriptionPlan(tenantId as string, {
      subscription_plan_id: subscriptionPlan.id,
    });
  }

  useEffect(() => {
    if (createTenantSubscriptionPlanData) {
      api.success({
        message: t('subscriptionPlan.messages.createTenantSubscriptionPlanSuccess'),
      });

      const timer = setTimeout(() => {
        navigate(`/tenants/${tenantId}/detail`);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [createTenantSubscriptionPlanData]);

  useEffect(() => {
    if (createTenantSubscriptionPlanError) {
      api.error({
        message: t('subscriptionPlan.messages.createTenantSubscriptionPlanError'),
      });
    }
  }, [createTenantSubscriptionPlanError]);

  useEffect(() => {
    getAvailableSubscriptionPlan();
    getTenantActiveSubscriptionPlan(tenantId as string);
  }, [tenantId]);

  return (
    <PortalLayoutV2
      title={t('subscriptionPlan.upgradeYourSubscriptionPlan')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <BaseDetailSection
        title={t('subscriptionPlan.selectSubscriptionPlan')}
        loading={createTenantSubscriptionPlanLoading}
      >
        <Typography.Text type="secondary">
          {t('subscriptionPlan.upgradeYourSubscriptionPlanDescription')}
        </Typography.Text>

        <Flex
          vertical={isMobile}
          gap={theme.custom.spacing.medium}
          style={{ width: '100%', overflowX: 'auto' }}
        >
          {availableSubscriptionPlans?.map((subscriptionPlan, index) => (
            <UpgradeSubscriptionPlanItem
              index={index}
              isCurrent={tenantActiveSubscriptionPlan?.id === subscriptionPlan.id}
              subscriptionPlan={subscriptionPlan}
              onSelect={(item) => handleUpgradeSubscriptionPlan(item)}
            />
          ))}
        </Flex>
      </BaseDetailSection>
    </PortalLayoutV2>
  );
};
