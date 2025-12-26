import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Empty, Typography } from 'antd';

import {
  useGetTenantActiveSubscriptionPlanApi,
  type GetTenantActiveSubscriptionPlanResponse,
} from '@shared/hooks/tenant/useGetTenantActiveSubscriptionPlanApi';

import { type Tenant } from '@shared/types/tenant';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import formatCurrencyCompact from '@shared/utils/currency';

interface Props {
  tenant: Tenant;
}

export const SubscriptionPlanSection: React.FC<Props> = ({ tenant }) => {
  const { t } = useTranslation();

  const {
    getTenantActiveSubscriptionPlan,
    data: tenantActiveSubscriptionPlan,
  } = useGetTenantActiveSubscriptionPlanApi<GetTenantActiveSubscriptionPlanResponse>();

  const handleGetTenantActiveSubscriptionPlan = () => {
    if (!tenant.id) return;

    getTenantActiveSubscriptionPlan(tenant.id);
  };

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
          <DataWrapper title={t('common.name')} value={tenantActiveSubscriptionPlan.name} />

          <DataWrapper title={t('common.price')} value={formatCurrencyCompact(tenantActiveSubscriptionPlan.price)} />

          <DataWrapper title={t('common.description')}>
            <Typography.Text type="secondary">
              {tenantActiveSubscriptionPlan.description}
            </Typography.Text>
          </DataWrapper>

          <DataWrapper
            title={t('subscriptionPlan.interval')}
            value={`${tenantActiveSubscriptionPlan.interval_count} (${t(`subscriptionPlan.${tenantActiveSubscriptionPlan.interval?.toLowerCase()}`)})`}
          />
        </>
      )}
    </BaseDetailSection>
  );
};
