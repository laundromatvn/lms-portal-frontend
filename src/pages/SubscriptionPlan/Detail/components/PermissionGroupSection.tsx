import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';

import { DataWrapper } from '@shared/components/DataWrapper';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';

interface Props {
  subscriptionPlan: SubscriptionPlan | null;
  loading?: boolean;
}

export const PermissionGroupSection: React.FC<Props> = ({ subscriptionPlan, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <BaseDetailSection
      title={t('subscriptionPlan.permissionGroup')}
      loading={loading}
      onEdit={() => navigate(`/subscription-plans/${subscriptionPlan?.id}/edit`)}
    >
      <DataWrapper
        title={t('subscriptionPlan.permissionGroup')}
        value={subscriptionPlan?.permission_group_name}
      />
    </BaseDetailSection>
  );
};
