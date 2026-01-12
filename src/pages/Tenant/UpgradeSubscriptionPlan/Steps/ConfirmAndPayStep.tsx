import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import {
  useGetSubscriptionPlanApi,
  type GetSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useGetSubscriptionPlanApi';

import {
  useCreateTenantSubscriptionPlanApi,
  type CreateTenantSubscriptionPlanResponse,
} from '@shared/hooks/tenant/useCreateTenantSubscriptionPlanApi';

import { QUERY_KEYS } from '../constants';

import { SubscriptionPlanCard } from '../components/SubscriptionPlanCard';
import { PaymentInformationSection } from '../components/PaymentInformationSection';


interface Props {
  tenantId: string;
  onBack: () => void;
}

export const ConfirmAndPayStep: React.FC<Props> = ({ tenantId, onBack }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [api, contextHolder] = notification.useNotification();

  const [searchParams] = useSearchParams();

  const subscriptionPlanId = searchParams.get(
    QUERY_KEYS.SUBSCRIPTION_PLAN_ID
  );

  const pricingOptionId = searchParams.get(
    QUERY_KEYS.PRICING_OPTION_ID
  );

  const {
    getSubscriptionPlan,
    data: subscriptionPlan,
  } = useGetSubscriptionPlanApi<GetSubscriptionPlanResponse>();

  const {
    createTenantSubscriptionPlan,
    data: createTenantSubscriptionPlanData,
    error: createTenantSubscriptionPlanError,
    loading: createTenantSubscriptionPlanLoading,
  } = useCreateTenantSubscriptionPlanApi<CreateTenantSubscriptionPlanResponse>();

  const handleOnPaid = () => {
    if (subscriptionPlanId && pricingOptionId) {
      createTenantSubscriptionPlan(tenantId, {
        subscription_plan_id: subscriptionPlanId,
        pricing_option_id: pricingOptionId,
      });
    }
  };

  useEffect(() => {
    if (createTenantSubscriptionPlanData) {
      api.success({
        message: t('subscription.messages.createTenantSubscriptionPlanSuccess'),
      });

      const timer = setTimeout(() => {
        onBack();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [createTenantSubscriptionPlanData, onBack]);

  useEffect(() => {
    if (createTenantSubscriptionPlanError) {
      api.error({
        message: t('subscription.messages.createTenantSubscriptionPlanError'),
      });
    }
  }, [createTenantSubscriptionPlanError]);

  useEffect(() => {
    if (subscriptionPlanId) {
      getSubscriptionPlan(subscriptionPlanId);
    }
  }, [subscriptionPlanId]);

  if (!subscriptionPlanId || !subscriptionPlan) {
    return null;
  }

  return (
    <BaseDetailSection title={t('subscription.confirmAndPay')}>
      {contextHolder}

      <Flex
        vertical={isMobile}
        gap={theme.custom.spacing.medium}
        style={{ width: '100%' }}
      >
        <PaymentInformationSection
          onPaid={handleOnPaid}
        />

        {subscriptionPlan && (
          <SubscriptionPlanCard
            subscriptionPlan={subscriptionPlan}
            pricingOptionId={pricingOptionId || ''}
          />
        )}
      </Flex>
    </BaseDetailSection>
  );
};
