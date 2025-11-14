import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Typography,
  Skeleton,
} from 'antd';

import {
  CashOut,
  CourseUp,
  CartCheck,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';

import {
  useGetDashboardOverviewKeyMetricsApi
} from '@shared/hooks/dashboard/useGetDashboardOverviewKeyMetricsApi';

import { KeyMetricList } from './KeyMetricList';

import type { StoreKeyMetrics as StoreKeyMetricsType } from './types';
import { LiquidKeyMetricList } from './LiquidKeyMetricList';

import formatCurrencyCompact from '@shared/utils/currency';

interface Props {
  store: Store;
}

export const StoreKeyMetrics: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [keyMetrics, setKeyMetrics] = useState<StoreKeyMetricsType[]>([]);
  const [liquidKeyMetrics, setLiquidKeyMetrics] = useState<StoreKeyMetricsType[]>([]);

  const {
    getDashboardOverviewKeyMetrics,
    data: dashboardOverviewKeyMetrics,
    loading: dashboardOverviewKeyMetricsLoading,
  } = useGetDashboardOverviewKeyMetricsApi();

  useEffect(() => {
    getDashboardOverviewKeyMetrics({ store_id: store.id });
  }, []);

  useEffect(() => {
    if (dashboardOverviewKeyMetrics) {
      setKeyMetrics([
        {
          label: t('overviewV2.revenueByDay'),
          value: formatCurrencyCompact(dashboardOverviewKeyMetrics.revenue_by_day),
          description: t('overviewV2.revenueByDayDescription'),
          icon: <CashOut size={32} weight="BoldDuotone" />,
        },
        {
          label: t('overviewV2.revenueByMonth'),
          value: formatCurrencyCompact(dashboardOverviewKeyMetrics.revenue_by_month),
          description: t('overviewV2.revenueByMonthDescription'),
          icon: <CourseUp size={32} weight="BoldDuotone" />,
        },
        {
          label: t('overviewV2.totalOrdersToday'),
          value: `${dashboardOverviewKeyMetrics.total_in_progress_orders} / ${dashboardOverviewKeyMetrics.today_orders}`,
          description: t('overviewV2.totalOrdersTodayDescription'),
          icon: <CartCheck size={32} weight="BoldDuotone" />,
        },
      ]);

      setLiquidKeyMetrics([
        {
          label: t('overviewV2.totalWashers'),
          value: Math.round((dashboardOverviewKeyMetrics.total_in_progress_washers / dashboardOverviewKeyMetrics.total_washers) * 100).toString(),
          description: t('overviewV2.totalWashersDescription'),
        },
        {
          label: t('overviewV2.totalDryers'),
          value: Math.round((dashboardOverviewKeyMetrics.total_in_progress_dryers / dashboardOverviewKeyMetrics.total_dryers) * 100).toString(),
          description: t('overviewV2.totalDryersDescription'),
        },
      ]);
    }
  }, [dashboardOverviewKeyMetrics]);

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Typography.Text strong style={{ fontSize: theme.custom.fontSize.large }}>
        {t('overviewV2.keyMetrics')}
      </Typography.Text>

      {dashboardOverviewKeyMetricsLoading ? (
        <Skeleton active style={{ width: '100%' }} />
      ) : (
        <>
          <KeyMetricList keyMetrics={keyMetrics} />
          <LiquidKeyMetricList keyMetrics={liquidKeyMetrics} />
        </>
      )}
    </Flex>
  );
};
