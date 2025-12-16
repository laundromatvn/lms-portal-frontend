import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';
import type { StoreOverviewFilter } from '../types';

import { useListOverviewOrderApi } from '@shared/hooks/dashboard/useListOverviewOrderApi';

import { TopOrderOverviewList } from './List';
import { BaseSectionTitle } from '@shared/components/BaseSectionTitle';

import dayjs from '@shared/utils/dayjs';

interface Props {
  store: Store;
  filters: StoreOverviewFilter[];
  datetimeFilters?: {
    start_datetime: string;
    end_datetime: string;
  };
}

export const TopOrderOverview: React.FC<Props> = ({ store, filters, datetimeFilters }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    listOverviewOrder,
    data: listOverviewOrderData,
    loading: listOverviewOrderLoading,
  } = useListOverviewOrderApi();

  const handleListOverviewOrder = async () => {
    const queryParams = {
      store_id: store.id,
      page: 1,
      page_size: 5,
    } as Record<string, any>;

    // Use datetime filters from MoreFilterDrawer if provided, otherwise use chip filter dates
    const hasCustomDatetime = (datetimeFilters?.start_datetime && datetimeFilters.start_datetime !== '') ||
                              (datetimeFilters?.end_datetime && datetimeFilters.end_datetime !== '');

    if (hasCustomDatetime) {
      // If custom datetime filters are set, use them (can be undefined if cleared)
      queryParams.start_date = datetimeFilters?.start_datetime && datetimeFilters.start_datetime !== ''
        ? datetimeFilters.start_datetime
        : undefined;
      queryParams.end_date = datetimeFilters?.end_datetime && datetimeFilters.end_datetime !== ''
        ? datetimeFilters.end_datetime
        : undefined;
    } else {
      // Use chip filter dates
      const today = dayjs();

      if (filters.find((filter) => filter.value === 'today')) {
        queryParams.start_date = today.startOf('day').toISOString();
        queryParams.end_date = today.endOf('day').toISOString();
      } else if (filters.find((filter) => filter.value === 'yesterday')) {
        queryParams.start_date = today.subtract(1, 'day').startOf('day').toISOString();
        queryParams.end_date = today.subtract(1, 'day').endOf('day').toISOString();
      } else if (filters.find((filter) => filter.value === 'this_week')) {
        queryParams.start_date = today.startOf('week').toISOString();
        queryParams.end_date = today.endOf('week').toISOString();
      } else if (filters.find((filter) => filter.value === 'this_month')) {
        queryParams.start_date = today.startOf('month').toISOString();
        queryParams.end_date = today.endOf('month').toISOString();
      } else if (filters.find((filter) => filter.value === 'all')) {
        queryParams.start_date = undefined;
        queryParams.end_date = undefined;
      }
    }

    await listOverviewOrder(queryParams);
  };

  useEffect(() => {
    handleListOverviewOrder();
  }, [filters, datetimeFilters]);

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <BaseSectionTitle
        title={t('overviewV2.topOrderOverview', { topOrders: 5 })}
        onRefresh={handleListOverviewOrder}
      />

      <TopOrderOverviewList
        orders={listOverviewOrderData?.data || []}
        loading={listOverviewOrderLoading}
      />
    </Flex>
  );
};
