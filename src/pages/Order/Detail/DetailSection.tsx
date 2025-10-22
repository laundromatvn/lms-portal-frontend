import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Order } from '@shared/types/Order';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';
import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  order: Order;
}

export const DetailSection: React.FC<Props> = ({ order }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <BaseDetailSection title={t('common.orderDetail')}>
      <DataWrapper title={t('common.transactionCode')} value={order.transaction_code || '-'} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={order.status} />
      </DataWrapper>
      <DataWrapper title={t('common.totalAmount')} value={formatCurrencyCompact(order.total_amount || 0)} />
      <DataWrapper title={t('common.totalWasher')} value={order.total_washer || 0} />
      <DataWrapper title={t('common.totalDryer')} value={order.total_dryer || 0} />
      <DataWrapper title={t('common.store')}>
        <Typography.Link
          onClick={() => navigate(`/stores/${order.store_id}/detail`)}
          style={{ cursor: 'pointer' }}
        >
          {order.store_name || '-'}
        </Typography.Link>
      </DataWrapper>
    </BaseDetailSection>
  );
};
