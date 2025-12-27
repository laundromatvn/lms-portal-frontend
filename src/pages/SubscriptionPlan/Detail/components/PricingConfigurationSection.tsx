import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';

import { DataWrapper } from '@shared/components/DataWrapper';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  subscriptionPlan: SubscriptionPlan | null;
  loading?: boolean;
}

export const PricingConfigurationSection: React.FC<Props> = ({ subscriptionPlan, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <BaseDetailSection
      title={t('subscription.pricingConfiguration')}
      loading={loading}
      onEdit={() => navigate(`/subscription-plans/${subscriptionPlan?.id}/edit`)}
    >
      <DataWrapper
        title={t('common.price')}
        value={formatCurrencyCompact(subscriptionPlan?.price || 0)}
      />

      <DataWrapper
        title={t('subscription.type')}
        value={t(`subscription.${subscriptionPlan?.type.toLowerCase()}`)}
      />

      <DataWrapper
        title={t('subscription.interval')}
        value={`${subscriptionPlan?.interval_count} (${t(`subscriptionPlan.${subscriptionPlan?.interval?.toLowerCase()}`)})`}
      />

      <DataWrapper
        title={t('subscription.trialPeriodCount')}
        value={`${subscriptionPlan?.trial_period_count} (${t(`subscriptionPlan.${subscriptionPlan?.interval?.toLowerCase()}`)})`}
      />
    </BaseDetailSection>
  );
};
