import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Order } from '@shared/types/Order';

import { Box } from '@shared/components/Box';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  order: Order;
}

export const DetailSection: React.FC<Props> = ({ order }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Typography.Title level={3}>{t('common.orderDetail')}</Typography.Title>

      <DataWrapper title={t('common.orderId')} value={order.id || '-'} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={order.status} />
      </DataWrapper>
      <DataWrapper title={t('common.totalAmount')} value={order.total_amount || '-'} />
      <DataWrapper title={t('common.totalWasher')} value={order.total_washer || '-'} />
      <DataWrapper title={t('common.totalDryer')} value={order.total_dryer || '-'} />
      <DataWrapper title={t('common.store')}>
        <Typography.Link
          onClick={() => navigate(`/stores/${order.store_id}/detail`)}
          style={{ cursor: 'pointer' }}
        >
          {order.store_name || '-'}
        </Typography.Link>
      </DataWrapper>
    </Box>
  );
};
