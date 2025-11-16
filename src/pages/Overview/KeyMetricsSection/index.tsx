import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Skeleton, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { tenantStorage } from '@core/storage/tenantStorage';
import { useGetDashboardOverviewKeyMetricsApi } from '@shared/hooks/dashboard/useGetDashboardOverviewKeyMetricsApi';

import { Box } from '@shared/components/Box';
import { KeyMetricItemList } from './List';

import type { DashboardOverviewKeyMetrics } from '@shared/types/dashboard/DashboardOverviewKeyMetrics';
import LeftRightSection from '@shared/components/LeftRightSection';
import { Refresh } from '@solar-icons/react';

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

  const handleGetDashboardOverviewKeyMetrics = async () => {
    await getDashboardOverviewKeyMetrics({
      tenant_id: tenant?.id as string,
    });
  };

  useEffect(() => {
    handleGetDashboardOverviewKeyMetrics();
  }, []);

  if (dashboardOverviewKeyMetricsLoading) {
    return <Skeleton active />;
  }

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <LeftRightSection
        left={<Typography.Title level={3}>{t('overview.keyMetrics.title')}</Typography.Title>}
        right={<Button type="text" onClick={handleGetDashboardOverviewKeyMetrics} icon={<Refresh size={18} />} />}
      />

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