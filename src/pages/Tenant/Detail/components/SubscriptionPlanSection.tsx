import React from 'react';
import { useTranslation } from 'react-i18next';

import { Empty, Typography } from 'antd';

import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import formatCurrencyCompact from '@shared/utils/currency';

interface Props {
  subscriptionPlan: SubscriptionPlan | null;
  loading?: boolean;
}

export const SubscriptionPlanSection: React.FC<Props> = ({ subscriptionPlan, loading }) => {
  const { t } = useTranslation();

  return (
    <BaseDetailSection
      title={t('tenant.detail.subscriptionPlan')}
      loading={loading}

    >
      {!subscriptionPlan && (
        <Empty
          description={t('tenant.messages.subscriptionPlanNotFound')}
          style={{ width: '100%' }}
        />
      )}

      {subscriptionPlan && (
        <>
          <DataWrapper title={t('common.name')} value={subscriptionPlan.name} />

          <DataWrapper title={t('common.price')} value={formatCurrencyCompact(subscriptionPlan.price)} />

          <DataWrapper title={t('common.description')}>
            <Typography.Text type="secondary">
              {subscriptionPlan.description}
            </Typography.Text>
          </DataWrapper>

          <DataWrapper
            title={t('subscriptionPlan.interval')}
            value={`${subscriptionPlan.interval_count} (${t(`subscriptionPlan.${subscriptionPlan.interval?.toLowerCase()}`)})`}
          />
        </>
      )}
    </BaseDetailSection>
  );
};
