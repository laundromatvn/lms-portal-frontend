import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Skeleton } from 'antd';

import {
  CashOut,
  CartCheck,
  CheckCircle,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';

import {
  useGetDashboardOverviewKeyMetricsApi
} from '@shared/hooks/dashboard/useGetDashboardOverviewKeyMetricsApi';

import { KeyMetricList } from './KeyMetricList';

import type { StoreKeyMetrics as StoreKeyMetricsType } from './types';
import { LiquidKeyMetricList } from './LiquidKeyMetricList';
import type { StoreOverviewFilter } from '../types';

import formatCurrencyCompact from '@shared/utils/currency';
import { BaseSectionTitle } from '@shared/components/BaseSectionTitle';

interface Props {
  store: Store;
  filters: StoreOverviewFilter[];
}

export const StoreKeyMetrics: React.FC<Props> = ({ store, filters }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [keyMetrics, setKeyMetrics] = useState<StoreKeyMetricsType[]>([]);
  const [liquidKeyMetrics, setLiquidKeyMetrics] = useState<StoreKeyMetricsType[]>([]);

  const {
    getDashboardOverviewKeyMetrics,
    data: dashboardOverviewKeyMetrics,
    loading: dashboardOverviewKeyMetricsLoading,
  } = useGetDashboardOverviewKeyMetricsApi();

  const dateLabel = () => {
    if (filters.find((filter) => filter.value === 'today')) {
      return t('overviewV2.today');
    } else if (filters.find((filter) => filter.value === 'this_week')) {
      return t('overviewV2.thisWeek');
    } else if (filters.find((filter) => filter.value === 'this_month')) {
      return t('overviewV2.thisMonth');
    } else if (filters.find((filter) => filter.value === 'this_year')) {
      return t('overviewV2.thisYear');
    }

    return '';
  };

  const handleGetDashboardOverviewKeyMetrics = async () => {
    const queryParams = {
      store_id: store.id,
    } as Record<string, any>;

    if (filters.find((filter) => filter.value === 'today')) {
      queryParams.start_date = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
      queryParams.end_date = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
    } else if (filters.find((filter) => filter.value === 'this_week')) {
      queryParams.start_date = new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString();
      queryParams.end_date = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)).toISOString();
    } else if (filters.find((filter) => filter.value === 'this_month')) {
      queryParams.start_date = new Date(new Date().setDate(1)).toISOString();
      queryParams.end_date = new Date(new Date().setDate(new Date().getDate())).toISOString();
    } else if (filters.find((filter) => filter.value === 'this_year')) {
      queryParams.start_date = new Date(new Date().getFullYear(), 0, 1).toISOString();
      queryParams.end_date = new Date(new Date().getFullYear(), 11, 31).toISOString();
    }

    await getDashboardOverviewKeyMetrics(queryParams);
  };

  useEffect(() => {
    handleGetDashboardOverviewKeyMetrics();
  }, [filters]);

  useEffect(() => {
    if (!dashboardOverviewKeyMetrics) return;

    setKeyMetrics([
      {
        label: t('overviewV2.revenue', { date: dateLabel() }),
        value: formatCurrencyCompact(dashboardOverviewKeyMetrics.revenue_by_day),
        icon: <CashOut size={32} weight="BoldDuotone" />,
      },
      {
        label: t('overviewV2.totalOrders', { date: dateLabel() }),
        value: `${dashboardOverviewKeyMetrics.total_in_progress_orders} / ${dashboardOverviewKeyMetrics.today_orders}`,
        icon: <CartCheck size={32} weight="BoldDuotone" />,
      },
      {
        label: t('overviewV2.finishedOrdersRate', { date: dateLabel() }),
        value: dashboardOverviewKeyMetrics.today_orders > 0 ? `${Math.round((dashboardOverviewKeyMetrics.total_finished_orders / dashboardOverviewKeyMetrics.today_orders) * 100)}%` : '0%',
        icon: <CheckCircle size={32} weight="BoldDuotone" />,
      },
    ]);

    setLiquidKeyMetrics([
      {
        label: t('overviewV2.totalWashers'),
        value: Math.round(dashboardOverviewKeyMetrics.total_in_progress_washers / dashboardOverviewKeyMetrics.total_washers * 100) / 100,
        description: t('overviewV2.totalWashersDescription'),
      },
      {
        label: t('overviewV2.totalDryers'),
        value: Math.round(dashboardOverviewKeyMetrics.total_in_progress_dryers / dashboardOverviewKeyMetrics.total_dryers * 100) / 100,
        description: t('overviewV2.totalDryersDescription'),
      },
    ]);
  }, 
  [dashboardOverviewKeyMetrics]);

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <BaseSectionTitle
        title={t('overviewV2.keyMetrics')}
        onRefresh={handleGetDashboardOverviewKeyMetrics}
      />

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
