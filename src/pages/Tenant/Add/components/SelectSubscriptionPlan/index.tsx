import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useCreateTenantSubscriptionPlanApi,
  type CreateTenantSubscriptionPlanResponse,
} from '@shared/hooks/tenant/useCreateTenantSubscriptionPlanApi';

import { type Tenant } from '@shared/types/tenant';
import { type SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';
import { type SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';

import { Box } from '@shared/components/Box';

import { SelectSubscriptionPlanSection } from './SelectSubscriptionPlanSection';
import { SelectPricingOptionSection } from './SelectPricingOptionSection';


interface Props {
  tenant: Tenant;
  onSave: () => void;
}

export const SelectSubscriptionPlan: React.FC<Props> = ({ tenant, onSave }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [api, contextHolder] = notification.useNotification();

  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedPricingOption, setSelectedPricingOption] = useState<SubscriptionPricingOption | null>(null);

  const {
    createTenantSubscriptionPlan,
    data: createTenantSubscriptionPlanData,
    error: createTenantSubscriptionPlanError,
    loading: createTenantSubscriptionPlanLoading,
  } = useCreateTenantSubscriptionPlanApi<CreateTenantSubscriptionPlanResponse>();

  const handleTenantSubscribePlan = () => {
    if (!selectedSubscriptionPlan?.id || !selectedPricingOption?.id) return;

    createTenantSubscriptionPlan(tenant.id, {
      subscription_plan_id: selectedSubscriptionPlan.id,
      pricing_option_id: selectedPricingOption.id,
    });
  };

  useEffect(() => {
    if (createTenantSubscriptionPlanError) {
      api.error({
        message: t('subscription.messages.createTenantSubscriptionPlanError'),
      });
    }
  }, [createTenantSubscriptionPlanError]);

  useEffect(() => {
    if (createTenantSubscriptionPlanData) {
      api.success({
        message: t('subscription.messages.createTenantSubscriptionPlanSuccess'),
      });

      onSave();
    }
  }, [createTenantSubscriptionPlanData]);

  return (
    <Box
      vertical
      gap={theme.custom.spacing.medium}
      loading={createTenantSubscriptionPlanLoading}
      style={{
        width: '100%',
        backgroundColor: 'transparent',
        padding: 0,
      }}
    >
      {contextHolder}

      <SelectSubscriptionPlanSection
        selectedSubscriptionPlan={selectedSubscriptionPlan}
        onSelect={(subscriptionPlan: SubscriptionPlan) => {
          setSelectedSubscriptionPlan(subscriptionPlan);
        }}
      />

      {selectedSubscriptionPlan && <SelectPricingOptionSection
        pricingOptions={selectedSubscriptionPlan.pricing_options}
        selectedPricingOption={selectedPricingOption}
        onSelect={(pricingOption: SubscriptionPricingOption) => {
          setSelectedPricingOption(pricingOption);
          handleTenantSubscribePlan();
        }}
      />}
    </Box>
  );
};
