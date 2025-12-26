import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Empty, Typography } from 'antd';

import {
  useGetTenantActiveSubscriptionPlanApi,
  type GetTenantActiveSubscriptionPlanResponse,
} from '@shared/hooks/tenant/useGetTenantActiveSubscriptionPlanApi';

import { type Tenant } from '@shared/types/tenant';
import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';
import { type Subscription } from '@shared/types/Subscription';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';

import formatCurrencyCompact from '@shared/utils/currency';
import { formatDateTime } from '@shared/utils/date';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  tenant: Tenant;
}

export const SubscriptionPlanSection: React.FC<Props> = ({ tenant }) => {
  const { t } = useTranslation();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);

  const {
    getTenantActiveSubscriptionPlan,
    data: tenantActiveSubscriptionPlan,
  } = useGetTenantActiveSubscriptionPlanApi<GetTenantActiveSubscriptionPlanResponse>();

  const handleGetTenantActiveSubscriptionPlan = () => {
    if (!tenant.id) return;

    getTenantActiveSubscriptionPlan(tenant.id);
  };

  useEffect(() => {
    if (tenantActiveSubscriptionPlan) {
      setSubscription(tenantActiveSubscriptionPlan);
      setSubscriptionPlan(tenantActiveSubscriptionPlan.subscription_plan);
    }
  }, [tenantActiveSubscriptionPlan]);

  useEffect(() => {
    handleGetTenantActiveSubscriptionPlan();
  }, [tenant.id]);

  return (
    <BaseDetailSection
      title={t('tenant.detail.subscriptionPlan')}
      onRefresh={handleGetTenantActiveSubscriptionPlan}
    >
      {!tenantActiveSubscriptionPlan && (
        <Empty
          description={t('tenant.messages.subscriptionPlanNotFound')}
          style={{ width: '100%' }}
        />
      )}

      {tenantActiveSubscriptionPlan && (
        <>
          <DataWrapper title={t('common.name')} value={subscriptionPlan?.name} />

          <DataWrapper title={t('common.price')} value={formatCurrencyCompact(subscriptionPlan?.price || 0)} />

          <DataWrapper title={t('common.description')}>
            <Typography.Text type="secondary">
              {subscriptionPlan?.description}
            </Typography.Text>
          </DataWrapper>

          <DataWrapper
            title={t('subscriptionPlan.interval')}
            value={`${subscriptionPlan?.interval_count} (${t(`subscriptionPlan.${subscriptionPlan?.interval?.toLowerCase()}`)})`}
          />
          
          <DataWrapper title={t('subscriptionPlan.status')}>
            <DynamicTag value={subscription?.status || ''} />
          </DataWrapper>

          <DataWrapper
            title={t('subscriptionPlan.trialEndDate')}
            value={subscription?.trial_end_date ? formatDateTime(subscription.trial_end_date) : t('common.unknown')}
          />

          <DataWrapper
            title={t('subscriptionPlan.nextRenewalDate')}
            value={subscription?.next_renewal_date ? formatDateTime(subscription.next_renewal_date) : t('common.unknown')}
          />

          <DataWrapper
            title={t('subscriptionPlan.startDate')}
            value={subscription?.start_date ? formatDateTime(subscription.start_date) : t('common.unknown')}
          />

          <DataWrapper
            title={t('subscriptionPlan.endDate')}
            value={subscription?.end_date ? formatDateTime(subscription.end_date) : t('common.unknown')}
          />
        </>
      )}
    </BaseDetailSection>
  );
};
