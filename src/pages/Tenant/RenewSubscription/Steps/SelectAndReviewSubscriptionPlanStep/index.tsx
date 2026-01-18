import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import {
  useGetCurrentTenantSubscriptionApi,
  type GetCurrentTenantSubscriptionResponse,
} from '@shared/hooks/user/useGetCurrentTenantSubscriptionApi';

import type { SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';

import { CurrentSubscriptionSection } from './CurrentSubscriptionSection';
import { PricingOptionsSelectSection } from './PricingOptionsSelectSection';
import { RenewOrderOverviewSection } from './RenewOrderOverviewSection';

interface Props {
  onSelectPlan: (subscriptionPlanId: string, pricingOptionId: string) => void;
}

export const SelectAndReviewSubscriptionPlanStep: React.FC<Props> = ({
  onSelectPlan,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [selectedPricingOption, setSelectedPricingOption] = useState<SubscriptionPricingOption | null>(null);

  const {
    getCurrentTenantSubscription,
    data: currentTenantSubscriptionData,
  } = useGetCurrentTenantSubscriptionApi<GetCurrentTenantSubscriptionResponse>();

  useEffect(() => {
    if (currentTenantSubscriptionData) {
      setSelectedPricingOption(currentTenantSubscriptionData.pricing_options[0]);
    }
  }, [currentTenantSubscriptionData]);

  useEffect(() => {
    getCurrentTenantSubscription();
  }, []);

  const handleContinue = () => {
    if (!currentTenantSubscriptionData?.subscription.subscription_plan_id || !selectedPricingOption?.id) return;

    onSelectPlan(
      currentTenantSubscriptionData.subscription.subscription_plan_id,
      selectedPricingOption.id
    );
  };

  if (!currentTenantSubscriptionData) return null;

  return (
    <Flex vertical={isMobile} gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <CurrentSubscriptionSection
        currentTenantSubscription={currentTenantSubscriptionData}
      />

      <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%', maxWidth: 600 }}>
        <PricingOptionsSelectSection
          pricingOptions={currentTenantSubscriptionData.pricing_options}
          selectedPricingOption={selectedPricingOption}
          onSelect={(pricingOption: SubscriptionPricingOption) => setSelectedPricingOption(pricingOption)}
        />
        <RenewOrderOverviewSection
          subscriptionPlanId={currentTenantSubscriptionData?.subscription.subscription_plan_id ?? ''}
          tenantId={currentTenantSubscriptionData?.subscription.tenant_id ?? ''}
          selectedPricingOption={selectedPricingOption}
        />

        <Button
          type='primary'
          size='large'
          onClick={handleContinue}
          disabled={!selectedPricingOption}
          style={{
            width: '100%',
          }}
        >
          {t('subscription.renewSubscription')}
        </Button>
      </Flex>
    </Flex>
  );
};
