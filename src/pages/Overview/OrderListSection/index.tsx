import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';
import { useListOverviewOrderApi } from '@shared/hooks/dashboard/useListOverviewOrderApi';

import { Box } from '@shared/components/Box';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { OverviewOrderListItem } from './ListItem';
import { Typography } from 'antd';

interface Props {
  style?: React.CSSProperties;
}

export const OrderListSection: React.FC<Props> = ({ style }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const tenant = tenantStorage.load();

  const {
    listOverviewOrder,
    data: listOverviewOrderData,
    loading: listOverviewOrderLoading,
  } = useListOverviewOrderApi();

  const handleListOverviewOrder = async () => {
    await listOverviewOrder({
      tenant_id: tenant?.id as string,
      order_by: 'created_at',
      order_direction: 'desc',
      page: 1,
      page_size: 5,
    });
  };

  useEffect(() => {
    handleListOverviewOrder();
  }, []);

  return (
    <BaseDetailSection title={t('overview.orderTable.title')} loading={listOverviewOrderLoading} onRefresh={handleListOverviewOrder}>
      {listOverviewOrderData?.data?.map((order) => (
        <OverviewOrderListItem key={order.id} order={order} />
      ))}

      <Typography.Link onClick={() => navigate('/orders')} style={{ width: '100%', textAlign: 'center' }}>View All</Typography.Link>
    </BaseDetailSection>
  );
};
