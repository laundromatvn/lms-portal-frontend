import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Divider, Flex, Typography, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { Play } from '@solar-icons/react';

import type { OverviewOrder } from '@shared/types/dashboard/OverviewOrder';
import type { OrderDetail } from '@shared/types/OrderDetail';

import {
  useListOrderDetailApi,
  type ListOrderDetailResponse,
} from '@shared/hooks/useListOrderDetailApi';
import {
  useStartMachineApi,
  type StartMachineResponse,
} from '@shared/hooks/useStartMachineApi';

import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatDateTime } from '@shared/utils/date';
import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  order: OverviewOrder;
}

export const StartOrderMachinesModalContent: React.FC<Props> = ({ order }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [api, contextHolder] = notification.useNotification();

  const {
    listOrderDetail,
    data: listOrderDetailData,
    loading: listOrderDetailLoading,
  } = useListOrderDetailApi<ListOrderDetailResponse>();
  const {
    startMachine,
    data: startMachineData,
    loading: startMachineLoading,
    error: startMachineError,
  } = useStartMachineApi<StartMachineResponse>();

  const handleListOrderDetail = async () => {
    await listOrderDetail({ order_id: order.id, page: 1, page_size: 100 });
  }

  const handleStartMachine = async (orderDetail: OrderDetail) => {
    await startMachine(orderDetail.machine_id, Number(orderDetail.price));
  }

  useEffect(() => {
    handleListOrderDetail();
  }, [order]);

  useEffect(() => {
    if (startMachineError) {
      api.error({
        message: t('messages.startMachineError'),
      });
    }
  }, [startMachineError]);

  useEffect(() => {
    if (startMachineData) {
      api.success({
        message: t('messages.startMachineSuccess'),
      });

      handleListOrderDetail();
    }
  }, [startMachineData]);

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      {contextHolder}

      <Typography.Title level={3}>{t('overview.orderTable.orderDetail', { orderId: order.transaction_code })}</Typography.Title>

      <Box vertical gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
        <Typography.Text strong>{t('common.orderDetail')}</Typography.Text>

        <Typography.Text type="secondary">{t('overview.orderTable.orderDetail', { orderId: order.transaction_code })}</Typography.Text>
        <Typography.Text type="secondary">{t('overview.orderTable.status')}: <DynamicTag value={order.status} /> </Typography.Text>

        <Typography.Text type="secondary">{t('overview.orderTable.dateAndTime')}: {formatDateTime(order.created_at)}</Typography.Text>
        <Typography.Text type="secondary">{t('overview.orderTable.totalAmount')}: {formatCurrencyCompact(order.total_amount)}</Typography.Text>

        <Typography.Text type="secondary">{t('overview.orderTable.totalWasher')}: {order.total_washer}</Typography.Text>
        <Typography.Text type="secondary">{t('overview.orderTable.totalDryer')}: {order.total_dryer}</Typography.Text>
      </Box>

      <Box vertical gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Typography.Text strong>{t('common.machineList')}</Typography.Text>

        {listOrderDetailData?.data.map((detail, index) => (
          <Box border vertical justify="space-between" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
            <Flex justify="space-between" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
              <Typography.Text>{index + 1}. {detail.machine_name || `${t('common.machine')} ${detail.machine_relay_no}`}</Typography.Text>
              <DynamicTag value={detail.status} />
            </Flex>

            <Typography.Text type="secondary">{t('common.price')}: {formatCurrencyCompact(detail.price)}</Typography.Text>

            <Divider style={{ margin: 0 }} />

            <Flex justify="end" style={{ width: '100%' }}>
              <Button
                type="text"
                icon={<Play weight="Bold" />}
                onClick={() => handleStartMachine(detail)}
                style={{ color: theme.custom.colors.success.default }}
                loading={startMachineLoading}
              />
            </Flex>
          </Box>
        ))}
      </Box>
    </Flex>
  );
};