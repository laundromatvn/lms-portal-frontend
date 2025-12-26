import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from 'antd';

import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';

import { DataWrapper } from '@shared/components/DataWrapper';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatDateTime } from '@shared/utils/date';

interface Props {
  subscriptionPlan: SubscriptionPlan | null;
  loading?: boolean;
}

export const BasicInformationSection: React.FC<Props> = ({ subscriptionPlan, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <BaseDetailSection
      title={t('subscriptionPlan.basicInformation')}
      loading={loading}
      onEdit={() => navigate(`/subscription-plans/${subscriptionPlan?.id}/edit`)}
    >
      <DataWrapper title={t('common.createdAt')}>
        <Typography.Text type="secondary">
          {formatDateTime(subscriptionPlan?.created_at || '')}
        </Typography.Text>
      </DataWrapper>

      <DataWrapper title={t('common.updatedAt')}>
        <Typography.Text type="secondary">
          {formatDateTime(subscriptionPlan?.updated_at || '')}
        </Typography.Text>
      </DataWrapper>

      <DataWrapper title={t('subscriptionPlan.name')} value={subscriptionPlan?.name} />

      <DataWrapper title={t('subscriptionPlan.isEnabled')}>
        <DynamicTag value={subscriptionPlan?.is_enabled ? 'enabled' : 'disabled'} />
      </DataWrapper>

      <DataWrapper title={t('subscriptionPlan.isDefault')}>
        <DynamicTag value={subscriptionPlan?.is_default ? 'enabled' : 'disabled'} />
      </DataWrapper>

      <DataWrapper title={t('common.description')}>
        <Typography.Text type="secondary">
          {subscriptionPlan?.description}
        </Typography.Text>
      </DataWrapper>
    </BaseDetailSection>
  );
};
