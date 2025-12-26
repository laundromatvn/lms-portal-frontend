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
      title={t('subscriptionPlan.pricingConfiguration')}
      loading={loading}
      onEdit={() => navigate(`/subscription-plans/${subscriptionPlan?.id}/edit`)}
    >
      <DataWrapper
        title={t('common.price')}
        value={formatCurrencyCompact(subscriptionPlan?.price || 0)}
      />

      <DataWrapper
        title={t('subscriptionPlan.type')}
        value={t(`subscriptionPlan.${subscriptionPlan?.type.toLowerCase()}`)}
      />

      <DataWrapper
        title={t('subscriptionPlan.interval')}
        value={`${subscriptionPlan?.interval_count} (${t(`subscriptionPlan.${subscriptionPlan?.interval?.toLowerCase()}`)})`}
      />

      <DataWrapper
        title={t('subscriptionPlan.trialPeriodCount')}
        value={`${subscriptionPlan?.trial_period_count} (${t(`subscriptionPlan.${subscriptionPlan?.interval?.toLowerCase()}`)})`}
      />
    </BaseDetailSection>
  );
};
