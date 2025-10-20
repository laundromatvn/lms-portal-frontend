import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Skeleton, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';
import { useGetOverviewStoreKeyMetricsApi } from '@shared/hooks/dashboard/useGetOverviewStoreKeyMetricsApi';

import { Box } from '@shared/components/Box';
import { StoreKeyMetricsTable } from './Table';

import type { OverviewStoreKeyMetrics } from '@shared/types/dashboard/OverviewStoreKeyMetrics';

interface Props {
  style?: React.CSSProperties;
}

export const StoreKeyMetricsSection: React.FC<Props> = ({ style }) => {
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
    <Box
      vertical
      gap={theme.custom.spacing.medium}
      style={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'auto',
        ...style,
      }}
    >
      <Typography.Title level={3}>
        {t('overview.storeKeyMetrics.title')}
      </Typography.Title>

      {storeKeyMetricsLoading ? (
        <Skeleton active />
      ) : (
        <StoreKeyMetricsTable
          storeKeyMetrics={storeKeyMetrics?.store_key_metrics as OverviewStoreKeyMetrics[]}
        />
      )}
    </Box>
  );
};
