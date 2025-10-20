import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Skeleton, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';
import { useGetRevenueByDayBarChartApi } from '@shared/hooks/dashboard/useGetRevenueByDayBarChartApi';

import { Box } from '@shared/components/Box';
import { RevenueByDayBarChart } from './Chart';

interface Props {
  style?: React.CSSProperties;
}

export const RevenueByDayBarChartSection: React.FC<Props> = ({ style }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const tenant = tenantStorage.load();

  const {
    getRevenueByDayBarChart,
    data: revenueByDayBarChart,
    loading: revenueByDayBarChartLoading,
    error: revenueByDayBarChartError,
  } = useGetRevenueByDayBarChartApi();

  useEffect(() => {
    getRevenueByDayBarChart({ tenant_id: tenant?.id as string });
  }, []);

  if (revenueByDayBarChartLoading) {
    return <Skeleton active />;
  }

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Typography.Title level={3}>
        {t('overview.revenueByDay.title')}
      </Typography.Title>

      {revenueByDayBarChartLoading ? (
        <Skeleton active />
      ) : (
        <RevenueByDayBarChart 
          labels={revenueByDayBarChart?.labels}
          values={revenueByDayBarChart?.values}
        />
      )}
    </Box>
  );
};