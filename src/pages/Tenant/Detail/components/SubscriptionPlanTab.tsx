import React, { useEffect } from 'react';

import { type Tenant } from '@shared/types/tenant';

import {
  useGetTenantActiveSubscriptionPlanApi,
  type GetTenantActiveSubscriptionPlanResponse,
} from '@shared/hooks/tenant/useGetTenantActiveSubscriptionPlanApi';

import { SubscriptionPlanSection } from './SubscriptionPlanSection';

interface Props {
  tenant: Tenant;
}

export const SubscriptionPlanTab: React.FC<Props> = ({ tenant }: Props) => {
  const {
    getTenantActiveSubscriptionPlan,
    data: tenantActiveSubscriptionPlan,
    loading: tenantActiveSubscriptionPlanLoading,
  } = useGetTenantActiveSubscriptionPlanApi<GetTenantActiveSubscriptionPlanResponse>();

  const handleGetTenantActiveSubscriptionPlan = () => {
    if (!tenant.id) return;

    getTenantActiveSubscriptionPlan(tenant.id);
  };

  useEffect(() => {
    handleGetTenantActiveSubscriptionPlan();
  }, [tenant.id]);

  return (
    <>
      <SubscriptionPlanSection
        subscriptionPlan={tenantActiveSubscriptionPlan}
        loading={tenantActiveSubscriptionPlanLoading}
      />
    </>
  );
};
