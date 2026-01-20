import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Empty, Tag, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useGetTenantActiveSubscriptionPlanApi,
  type GetTenantActiveSubscriptionPlanResponse,
} from '@shared/hooks/tenant/useGetTenantActiveSubscriptionPlanApi';

import { type Tenant } from '@shared/types/tenant';
import { type SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';
import { type Subscription } from '@shared/types/subscription/Subscription';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatDateTime } from '@shared/utils/date';

import dayjs from 'dayjs';

interface Props {
  tenant: Tenant;
}

export const SubscriptionPlanSection: React.FC<Props> = ({ tenant }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);

  const {
    getTenantActiveSubscriptionPlan,
    data: tenantActiveSubscriptionPlan,
  } = useGetTenantActiveSubscriptionPlanApi<GetTenantActiveSubscriptionPlanResponse>();

  const renderEndDate = (subscription: Subscription) => {
    if (!subscription.end_date) return (
      <Typography.Text type="secondary">
        {t('common.unknown')}
      </Typography.Text>
    )

    const diffDays = dayjs(subscription.end_date).diff(dayjs(), 'day');
    const color = () => {
      if (diffDays < 0) return theme.custom.colors.danger.default;
      if (diffDays <= 7) return theme.custom.colors.warning.default;

      return theme.custom.colors.text.primary;
    };

    return (
      <Typography.Text style={{ color: color() }}>
        {formatDateTime(subscription.end_date)}
      </Typography.Text>
    )
  };

  const renderTrialEndDate = (subscription: Subscription) => {
    if (!subscription.trial_end_date) return (
      <Typography.Text type="secondary">
        {t('common.unknown')}
      </Typography.Text>
    )

    const diffDays = dayjs(subscription.trial_end_date).diff(dayjs(), 'day');
    const color = () => {
      if (diffDays < 0) return theme.custom.colors.text.primary;
      if (diffDays <= 7) return theme.custom.colors.warning.default;

      return theme.custom.colors.text.primary;
    };

    return (
      <Typography.Text style={{ color: color() }}>
        {formatDateTime(subscription.trial_end_date)}
      </Typography.Text>
    )
  };

  const renderNextRenewalDate = (subscription: Subscription) => {
    if (!subscription.next_renewal_date) return (
      <Typography.Text type="secondary">
        {t('common.unknown')}
      </Typography.Text>
    )


    const diffDays = dayjs(subscription.next_renewal_date).diff(dayjs(), 'day');
    const color = () => {
      if (diffDays < 0) return theme.custom.colors.danger.default;
      if (diffDays <= 7) return theme.custom.colors.warning.default;

      return theme.custom.colors.text.primary;
    };

    return (
      <Typography.Text style={{ color: color() }}>
        {formatDateTime(subscription.next_renewal_date)}
      </Typography.Text>
    )
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ACTIVE':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      case 'PAST_DUE':
        return 'warning';
      case 'EXPIRED':
        return 'danger';
      default:
        return 'default';
    }
  };

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
      title={t('subscription.subscriptions')}
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

          <DataWrapper title={t('common.description')}>
            <Typography.Text type="secondary">
              {subscriptionPlan?.description}
            </Typography.Text>
          </DataWrapper>

          <DataWrapper title={t('subscription.status')}>
            <Tag color={getStatusColor(subscription?.status || '')}>
              {t(`subscription.statuses.${subscription?.status}`)}
            </Tag>
          </DataWrapper>

          <DataWrapper
            title={t('subscription.startDate')}
            value={subscription?.start_date ? formatDateTime(subscription.start_date) : t('common.unknown')}
          />

          <DataWrapper title={t('subscription.trialEndDate')}>
            {subscription && renderTrialEndDate(subscription)}
          </DataWrapper>

          <DataWrapper title={t('subscription.endDate')}>
            {subscription && renderEndDate(subscription)}
          </DataWrapper>

          <DataWrapper title={t('subscription.nextRenewalDate')}>
            {subscription && renderNextRenewalDate(subscription)}
          </DataWrapper>
        </>
      )}
    </BaseDetailSection>
  );
};
