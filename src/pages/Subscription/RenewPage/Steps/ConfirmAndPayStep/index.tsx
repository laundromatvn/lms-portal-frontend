import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Flex, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import {
  useGetSubscriptionPlanApi,
  type GetSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useGetSubscriptionPlanApi';

import {
  useGetCurrentTenantSubscriptionApi,
  type GetCurrentTenantSubscriptionResponse,
} from '@shared/hooks/user/useGetCurrentTenantSubscriptionApi';

import {
  useRenewSubscriptionApi,
  type RenewSubscriptionResponse,
} from '@shared/hooks/subscription/useRenewSubscriptionApi';

import {
  usePreviewSubscriptionInvoiceApi,
  type PreviewSubscriptionInvoiceResponse,
} from '@shared/hooks/subscription/usePreviewSubscriptionInvoiceApi';

import { QUERY_KEYS } from '../../constants';

import { SubscriptionPlanCard } from './SubscriptionPlanCard';
import { PaymentInformationSection } from './PaymentInformationSection';
import { ConfirmRenewPlanSection } from './ConfirmRenewPlanSection';

interface Props {
  onBack: () => void;
}

export const ConfirmAndPayStep: React.FC<Props> = ({ onBack }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [searchParams] = useSearchParams();

  const subscriptionPlanId = searchParams.get(
    QUERY_KEYS.SUBSCRIPTION_PLAN_ID
  );

  const pricingOptionId = searchParams.get(
    QUERY_KEYS.PRICING_OPTION_ID
  );

  const [isConfirmed, setIsConfirmed] = useState(false);

  const {
    getSubscriptionPlan,
    data: subscriptionPlan,
  } = useGetSubscriptionPlanApi<GetSubscriptionPlanResponse>();

  const {
    getCurrentTenantSubscription,
    data: currentTenantSubscription,
  } = useGetCurrentTenantSubscriptionApi<GetCurrentTenantSubscriptionResponse>();

  const {
    renewSubscription,
    error: renewSubscriptionError,
    loading: renewSubscriptionLoading,
  } = useRenewSubscriptionApi<RenewSubscriptionResponse>();

  const {
    previewSubscriptionInvoice,
    data: previewSubscriptionInvoiceData,
  } = usePreviewSubscriptionInvoiceApi<PreviewSubscriptionInvoiceResponse>();

  const handleConfirmRenewPlan = () => {
    if (!pricingOptionId || !currentTenantSubscription?.subscription.id) return;

    renewSubscription(currentTenantSubscription.subscription.id, pricingOptionId);
  };

  const handleOnPaidSuccess = () => {
    navigate('/overview');
  };

  useEffect(() => {
    if (renewSubscriptionError) {
      api.error({
        message: t('subscription.messages.renewSubscriptionError'),
      });
    }
  }, [renewSubscriptionError]);

  useEffect(() => {
    if (subscriptionPlanId) {
      getSubscriptionPlan(subscriptionPlanId);
    }

    getCurrentTenantSubscription();
  }, [subscriptionPlanId]);

  useEffect(() => {
    const tenantId = currentTenantSubscription?.subscription.tenant_id;
    if (!tenantId || !pricingOptionId || !subscriptionPlanId) return;

    previewSubscriptionInvoice({
      subscription_plan_id: subscriptionPlanId,
      pricing_option_id: pricingOptionId,
      tenant_id: tenantId,
    });
  }, [currentTenantSubscription?.subscription.tenant_id, pricingOptionId, subscriptionPlanId]);

  if (!subscriptionPlanId || !subscriptionPlan || !currentTenantSubscription) {
    return null;
  }

  return (
    <BaseDetailSection title={t('subscription.confirmAndPay')}>
      {contextHolder}

      {isConfirmed ? (
        <PaymentInformationSection
          previewSubscriptionInvoiceResult={previewSubscriptionInvoiceData}
          onPaidSuccess={handleOnPaidSuccess}
          loading={renewSubscriptionLoading}
        />
      ) : (
        <Flex
          vertical={isMobile}
          gap={theme.custom.spacing.medium}
          style={{ width: '100%' }}
        >
          <ConfirmRenewPlanSection
            subscriptionPlan={subscriptionPlan}
            previewSubscriptionInvoiceResult={previewSubscriptionInvoiceData}
            onConfirmed={() => {
              setIsConfirmed(true);
              handleConfirmRenewPlan();
            }}
          />

          {subscriptionPlan && (
            <SubscriptionPlanCard
              subscriptionPlan={subscriptionPlan}
              pricingOptionId={pricingOptionId || ''}
            />
          )}
        </Flex>
      )}
    </BaseDetailSection>
  );
};
