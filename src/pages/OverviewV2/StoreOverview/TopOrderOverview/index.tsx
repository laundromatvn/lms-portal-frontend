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
    await listOverviewOrder({
      store_id: store.id,
      page: 1,
      page_size: 5,
    });
  };

  useEffect(() => {
    handleListOverviewOrder();
  }, []);

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
