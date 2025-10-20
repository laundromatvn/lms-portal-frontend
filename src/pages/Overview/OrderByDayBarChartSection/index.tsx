import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Skeleton, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';
import { useGetOrderByDayBarChartApi } from '@shared/hooks/dashboard/useGetOrderByDayBarChartApi';

import { Box } from '@shared/components/Box';
import { OrderByDayBarChart } from './Chart';

interface Props {
  style?: React.CSSProperties;
}

export const OrderByDayBarChartSection: React.FC<Props> = ({ style }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const tenant = tenantStorage.load();

  const {
    getOrderByDayBarChart,
    data: orderByDayBarChart,
    loading: orderByDayBarChartLoading,
    error: orderByDayBarChartError,
  } = useGetOrderByDayBarChartApi();

  useEffect(() => {
    getOrderByDayBarChart({ tenant_id: tenant?.id as string });
  }, []);

  if (orderByDayBarChartLoading) {
    return <Skeleton active />;
  }

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Typography.Title level={3}>
        {t('overview.totalOrdersByDay.title')}
      </Typography.Title>

      {orderByDayBarChartLoading ? (
        <Skeleton active />
      ) : (
        <OrderByDayBarChart 
          labels={orderByDayBarChart?.labels}
          values={orderByDayBarChart?.values}
        />
      )}
    </Box>
  );
};