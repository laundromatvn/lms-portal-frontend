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
  useCreateTenantSubscriptionPlanApi,
  type CreateTenantSubscriptionPlanResponse,
} from '@shared/hooks/tenant/useCreateTenantSubscriptionPlanApi';

import {
  usePreviewSubscriptionInvoiceApi,
  type PreviewSubscriptionInvoiceResponse,
} from '@shared/hooks/subscription/usePreviewSubscriptionInvoiceApi';

import { QUERY_KEYS } from '../../constants';

import { SubscriptionPlanCard } from './SubscriptionPlanCard';
import { PaymentInformationSection } from './PaymentInformationSection';
import { ConfirmUpgradePlanSection } from './ConfirmUpgradePlanSection';


interface Props {
  tenantId: string;
  onBack: () => void;
}

export const ConfirmAndPayStep: React.FC<Props> = ({ tenantId, onBack }) => {
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
    createTenantSubscriptionPlan,
    data: createTenantSubscriptionPlanData,
    error: createTenantSubscriptionPlanError,
    loading: createTenantSubscriptionPlanLoading,
  } = useCreateTenantSubscriptionPlanApi<CreateTenantSubscriptionPlanResponse>();

  const {
    previewSubscriptionInvoice,
    data: previewSubscriptionInvoiceData,
  } = usePreviewSubscriptionInvoiceApi<PreviewSubscriptionInvoiceResponse>();

  const handleConfirmUpgradePlan = () => {
    if (subscriptionPlanId && pricingOptionId) {
      createTenantSubscriptionPlan(tenantId, {
        subscription_plan_id: subscriptionPlanId,
        pricing_option_id: pricingOptionId,
      });
    }
  };

  const handleOnPaidSuccess = () => {
    navigate(`/tenants/${tenantId}/detail`);
  }

  useEffect(() => {
    if (createTenantSubscriptionPlanData) {
      api.success({
        message: t('subscription.messages.createTenantSubscriptionPlanSuccess'),
      });
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

  useEffect(() => {
    if (!tenantId || !pricingOptionId || !subscriptionPlanId) return;

    previewSubscriptionInvoice({
      subscription_plan_id: subscriptionPlanId,
      pricing_option_id: pricingOptionId,
      tenant_id: tenantId,
    });
  }, [tenantId, pricingOptionId, subscriptionPlanId]);

  if (!subscriptionPlanId || !subscriptionPlan) {
    return null;
  }

  return (
    <BaseDetailSection title={t('subscription.confirmAndPay')}>
      {contextHolder}

      {isConfirmed ? (
        <PaymentInformationSection
          previewSubscriptionInvoiceResult={previewSubscriptionInvoiceData}
          onPaidSuccess={handleOnPaidSuccess}
          loading={createTenantSubscriptionPlanLoading}
        />
      ) : (
        <Flex
          vertical={isMobile}
          gap={theme.custom.spacing.medium}
          style={{ width: '100%' }}
        >
          <ConfirmUpgradePlanSection
            subscriptionPlan={subscriptionPlan}
            previewSubscriptionInvoiceResult={previewSubscriptionInvoiceData}
            onConfirmed={() => {
              setIsConfirmed(true);
              handleConfirmUpgradePlan();
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
