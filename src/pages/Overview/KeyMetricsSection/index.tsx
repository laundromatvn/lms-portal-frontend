import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Skeleton, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { tenantStorage } from '@core/storage/tenantStorage';
import { useGetDashboardOverviewKeyMetricsApi } from '@shared/hooks/dashboard/useGetDashboardOverviewKeyMetricsApi';

import { Box } from '@shared/components/Box';
import { KeyMetricItemList } from './List';

import type { DashboardOverviewKeyMetrics } from '@shared/types/dashboard/DashboardOverviewKeyMetrics';

interface Props {
  style?: React.CSSProperties;
}

export const KeyMetricsSection: React.FC<Props> = ({ style }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const tenant = tenantStorage.load();

  const {
    getDashboardOverviewKeyMetrics,
    data: dashboardOverviewKeyMetrics,
    loading: dashboardOverviewKeyMetricsLoading,
    error: dashboardOverviewKeyMetricsError,
  } = useGetDashboardOverviewKeyMetricsApi();

  useEffect(() => {
    getDashboardOverviewKeyMetrics(tenant?.id as string);
  }, []);

  if (dashboardOverviewKeyMetricsLoading) {
    return <Skeleton active />;
  }

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Typography.Title level={3}>
        {t('overview.keyMetrics.title')}
      </Typography.Title>

      {dashboardOverviewKeyMetricsLoading ? (
        <Skeleton active />
      ) : (
        <KeyMetricItemList 
          dashboardOverviewKeyMetrics={dashboardOverviewKeyMetrics as DashboardOverviewKeyMetrics}
        />
      )}
    </Box>
  );
};