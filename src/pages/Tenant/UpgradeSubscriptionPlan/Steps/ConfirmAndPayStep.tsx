import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import {
  useGetSubscriptionPlanApi,
  type GetSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useGetSubscriptionPlanApi';

import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';

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

  const [searchParams] = useSearchParams();

  const subscriptionPlanId = searchParams.get(
    QUERY_KEYS.SUBSCRIPTION_PLAN_ID
  );

  const billingType = searchParams.get(
    QUERY_KEYS.BILLING_TYPE
  );

  const {
    getSubscriptionPlan,
    data: subscriptionPlan,
    loading: subscriptionPlanLoading,
  } = useGetSubscriptionPlanApi<GetSubscriptionPlanResponse>();

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
      <Flex
        vertical={isMobile}
        gap={theme.custom.spacing.medium}
        style={{ width: '100%' }}
      >
        <PaymentInformationSection />

        {subscriptionPlan && (
          <SubscriptionPlanCard
            subscriptionPlan={subscriptionPlan}
            billingType={billingType as SubscriptionPricingBillingTypEnum}
          />
        )}
      </Flex>
    </BaseDetailSection>
  );
};
