import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, Tag } from 'antd';

import { type CurrentTenantSubscription } from '@shared/types/user/CurrentTenantSubscription';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';

import { formatDateTime } from '@shared/utils/date';

interface Props {
  currentTenantSubscription: CurrentTenantSubscription;
}

export const CurrentSubscriptionSection: React.FC<Props> = ({ currentTenantSubscription }: Props) => {
  const { t } = useTranslation();

  const statusColor = useMemo(() => {
    switch (currentTenantSubscription.subscription.status) {
      case 'ACTIVE':
        return 'green';
      case 'PENDING':
        return 'yellow';
      case 'CANCELLED':
        return 'red';
      case 'PAST_DUE':
        return 'orange';
      case 'EXPIRED':
        return 'gray';
      default:
        return 'gray';
    }
  }, [currentTenantSubscription.subscription.status]);

  return (
    <BaseDetailSection title={t('subscription.yourSubscriptionPlan')}>
      <DataWrapper title={t('subscription.subscriptionPlan')}>
        <Typography.Text strong>
          {currentTenantSubscription.subscription_plan.name}
        </Typography.Text>
      </DataWrapper>

      <DataWrapper title={t('subscription.status')}>
        <Tag color={statusColor}>
          {t(`subscription.statuses.${currentTenantSubscription.subscription.status}`)}
        </Tag>
      </DataWrapper>

      <DataWrapper
        title={t('subscription.startDate')}
        value={currentTenantSubscription.subscription.start_date
          ? formatDateTime(currentTenantSubscription.subscription.start_date)
          : t('common.unknown')
        }
      />
      <DataWrapper
        title={t('subscription.endDate')}
        value={currentTenantSubscription.subscription.end_date
          ? formatDateTime(currentTenantSubscription.subscription.end_date)
          : t('common.unknown')}
      />
      <DataWrapper
        title={t('subscription.trialEndDate')}
        value={currentTenantSubscription.subscription.trial_end_date
          ? formatDateTime(currentTenantSubscription.subscription.trial_end_date)
          : t('common.unknown')}
      />
      <DataWrapper
        title={t('subscription.nextRenewalDate')}
        value={currentTenantSubscription.subscription.next_renewal_date
          ? formatDateTime(currentTenantSubscription.subscription.next_renewal_date)
          : t('common.unknown')}
      />
    </BaseDetailSection>
  );
};
