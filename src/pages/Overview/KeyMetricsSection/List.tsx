import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { DashboardOverviewKeyMetrics } from '@shared/types/dashboard/DashboardOverviewKeyMetrics';

import { KeyMetricItem } from './Item';

import formatCurrencyCompact from '@shared/utils/currency';

interface Props {
  dashboardOverviewKeyMetrics: DashboardOverviewKeyMetrics;
}

export const KeyMetricItemList: React.FC<Props> = ({ dashboardOverviewKeyMetrics }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <Flex
      gap={theme.custom.spacing.medium}
      style={{ width: '100%' }}
      vertical={isMobile}
    >
      <Flex vertical={isMobile} gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        <KeyMetricItem
          title={t('overview.keyMetrics.totalStores')}
          unit={t('overview.keyMetrics.totalStoresUnit')}
          value={`${dashboardOverviewKeyMetrics?.total_active_stores || 0} / ${dashboardOverviewKeyMetrics?.total_stores || 0}`}
          description={t('overview.keyMetrics.totalStoresDescription')}
          style={{ width: '100%' }}
        />

        <KeyMetricItem
          title={t('overview.keyMetrics.revenueByDay')}
          value={formatCurrencyCompact(dashboardOverviewKeyMetrics?.revenue_by_day || 0)}
          unit="VND"
          description={t('overview.keyMetrics.revenueByDayDescription')}
          style={{ width: '100%' }}
        />

        <KeyMetricItem
          title={t('overview.keyMetrics.revenueByMonth')}
          value={formatCurrencyCompact(dashboardOverviewKeyMetrics?.revenue_by_month || 0)}
          unit="VND"
          description={t('overview.keyMetrics.revenueByMonthDescription')}
          style={{ width: '100%' }}
        />

        <KeyMetricItem
          title={t('overview.keyMetrics.totalOrdersToday')}
          unit={t('overview.keyMetrics.totalOrdersTodayUnit')}
          value={`${dashboardOverviewKeyMetrics?.total_in_progress_orders || 0} / ${dashboardOverviewKeyMetrics?.today_orders || 0}`}
          description={t('overview.keyMetrics.totalOrdersTodayDescription')}
          style={{ width: '100%' }}
        />
      </Flex>

      <Flex vertical={isMobile} gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        <KeyMetricItem
          title={t('overview.keyMetrics.totalWashers')}
          unit={t('overview.keyMetrics.totalWashersUnit')}
          value={`${dashboardOverviewKeyMetrics?.total_in_progress_washers || 0} / ${dashboardOverviewKeyMetrics?.total_washers || 0}`}
          description={t('overview.keyMetrics.totalWashersDescription')}
          style={{ width: '100%' }}
        />

        <KeyMetricItem
          title={t('overview.keyMetrics.totalDryers')}
          unit={t('overview.keyMetrics.totalDryersUnit')}
          value={`${dashboardOverviewKeyMetrics?.total_in_progress_dryers || 0} / ${dashboardOverviewKeyMetrics?.total_dryers || 0}`}
          description={t('overview.keyMetrics.totalDryersDescription')}
          style={{ width: '100%' }}
        />
      </Flex>
    </Flex>
  );
};