import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Skeleton, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';
import { useGetOverviewStoreKeyMetricsApi } from '@shared/hooks/dashboard/useGetOverviewStoreKeyMetricsApi';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { StoreListSectionItem } from './Item';

interface Props {
  style?: React.CSSProperties;
}

export const StoreListSection: React.FC<Props> = ({ style }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const tenant = tenantStorage.load();

  const {
    getOverviewStoreKeyMetrics,
    data: storeKeyMetrics,
    loading: storeKeyMetricsLoading,
    error: storeKeyMetricsError,
  } = useGetOverviewStoreKeyMetricsApi();

  useEffect(() => {
    getOverviewStoreKeyMetrics({ tenant_id: tenant?.id as string });
  }, []);

  if (storeKeyMetricsLoading) {
    return <Skeleton active />;
  }

  return (
    <BaseDetailSection title={t('overview.storeKeyMetrics.title')}>
      {storeKeyMetrics?.store_key_metrics?.map((store, index) => (
        <StoreListSectionItem key={store.id} index={index} store={store} />
      ))}
    </BaseDetailSection>
  );
};
