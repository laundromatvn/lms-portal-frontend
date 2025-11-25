import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';
import type { StoreOverviewFilter } from '../types';

import { useListOverviewOrderApi } from '@shared/hooks/dashboard/useListOverviewOrderApi';

import { TopOrderOverviewList } from './List';
import { BaseSectionTitle } from '@shared/components/BaseSectionTitle';

interface Props {
  store: Store;
  filters: StoreOverviewFilter[];
}

export const TopOrderOverview: React.FC<Props> = ({ store, filters }) => {
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

    await listOverviewOrder(queryParams);
  };

  useEffect(() => {
    handleListOverviewOrder();
  }, [filters]);

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
