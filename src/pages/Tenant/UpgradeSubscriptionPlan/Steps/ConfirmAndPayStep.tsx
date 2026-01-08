import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import {
  useGetSubscriptionPlanApi,
  type GetSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useGetSubscriptionPlanApi';

import { QUERY_KEYS } from './constants';

import { SubscriptionPlanCard } from '../components/SubscriptionPlanCard';
import { PaymentInformationSection } from '../components/PaymentInformationSection';


interface Props {
  tenantId: string;
  onBack: () => void;
}

export const ConfirmAndPayStep: React.FC<Props> = ({ tenantId, onBack }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [searchParams] = useSearchParams();

  const subscriptionPlanId = searchParams.get(
    QUERY_KEYS.SUBSCRIPTION_PLAN_ID
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
      <Flex gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        {subscriptionPlan && (
          <SubscriptionPlanCard subscriptionPlan={subscriptionPlan} />
        )}

        <PaymentInformationSection />
      </Flex>
    </BaseDetailSection>
  );
};
