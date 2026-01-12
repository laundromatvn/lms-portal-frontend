import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Segmented, Typography, notification } from 'antd';

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
import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { SubscriptionPlanSelectItem } from '../components/SubscriptionPlanSelectItem';

import './styles.css';

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

  const [selectedBillingType, setSelectedBillingType] = useState<SubscriptionPricingBillingTypEnum>(SubscriptionPricingBillingTypEnum.RECURRING);
  const [filteredSubscriptionPlans, setFilteredSubscriptionPlans] = useState<SubscriptionPlan[]>([]);

  const {
    getAvailableSubscriptionPlan,
    data: availableSubscriptionPlansData,
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
    if (availableSubscriptionPlansData) {
      const filteredSubscriptionPlans = availableSubscriptionPlansData.filter((subscriptionPlan) => {
        return subscriptionPlan.pricing_options.some((pricingOption) => pricingOption.billing_type === selectedBillingType);
      });

      const sortedSubscriptionPlans = filteredSubscriptionPlans.sort((a, b) => {
        return a.pricing_options[0].base_unit_price - b.pricing_options[0].base_unit_price;
      });

      setFilteredSubscriptionPlans(sortedSubscriptionPlans);
    }
  }, [availableSubscriptionPlansData, selectedBillingType]);

  useEffect(() => {
    getAvailableSubscriptionPlan();
    getTenantActiveSubscriptionPlan(tenantId);
  }, [tenantId]);

  return (
    <div className="select-subscription-plan-step">
      <BaseDetailSection
        title={t('subscription.selectSubscriptionPlan')}
        onRefresh={getAvailableSubscriptionPlan}
        loading={getAvailableSubscriptionPlanLoading}
      >
        {contextHolder}

        <Typography.Text type="secondary">
          {t('subscription.upgradeSubscriptionPlanDescription')}
        </Typography.Text>

        <Flex justify="end" style={{ width: '100%' }}>
          <Segmented
            shape="round"
            options={[
              { label: t('subscription.recurring'), value: SubscriptionPricingBillingTypEnum.RECURRING },
              { label: t('subscription.oneTime'), value: SubscriptionPricingBillingTypEnum.ONE_TIME },
            ]}
            onChange={(value) => setSelectedBillingType(value as SubscriptionPricingBillingTypEnum)}
            style={{
              width: 'fit-content',
              backgroundColor: theme.custom.colors.background.dark,
              color: theme.custom.colors.text.inverted,
            }}
          />
        </Flex>

        <Flex
          vertical={isMobile}
          gap={theme.custom.spacing.medium}
          style={{ width: '100%', overflowX: 'auto' }}
        >
          {filteredSubscriptionPlans?.map((subscriptionPlan) => (
            <SubscriptionPlanSelectItem
              key={subscriptionPlan.id}
              selectedBillingType={selectedBillingType}
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
    </div>
  );
};
