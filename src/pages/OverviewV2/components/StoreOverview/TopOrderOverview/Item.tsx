import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Typography,
  notification,
} from 'antd';

import {
  CheckCircle,
  CloseCircle,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { OrderStatusEnum } from '@shared/enums/OrderStatusEnum';

import { useTriggerPaymentSuccessApi } from '@shared/hooks/useTriggerPaymentSuccessApi';
import { useTriggerPaymentFailedApi } from '@shared/hooks/useTriggerPaymentFailedApi';

import type { OverviewOrder } from '@shared/types/dashboard/OverviewOrder';

import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatCurrencyCompact } from '@shared/utils/currency';
import { formatDateTime } from '@shared/utils/date';

interface Props {
  order: OverviewOrder;
}

export const TopOrderOverviewItem: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const {
    triggerPaymentFailed,
    data: triggerPaymentFailedData,
    error: triggerPaymentFailedError,
  } = useTriggerPaymentFailedApi();
  const {
    triggerPaymentSuccess,
    data: triggerPaymentSuccessData,
    error: triggerPaymentSuccessError,
  } = useTriggerPaymentSuccessApi();

  useEffect(() => {
    if (triggerPaymentFailedError) {
      api.error({
        message: t('messages.triggerPaymentFailedError'),
      });
    }
  }, [triggerPaymentFailedError]);

  useEffect(() => {
    if (triggerPaymentFailedData) {
      api.success({
        message: t('messages.triggerPaymentFailedSuccess'),
      });
    }
  }, [triggerPaymentFailedData]);

  useEffect(() => {
    if (triggerPaymentSuccessError) {
      api.error({
        message: t('messages.triggerPaymentSuccessError'),
      });
    }
  }, [triggerPaymentSuccessError]);

  useEffect(() => {
    if (triggerPaymentSuccessData) {
      api.success({
        message: t('messages.triggerPaymentSuccessSuccess'),
      });
    }
  }, [triggerPaymentSuccessData]);

  return (
    <Box
      vertical
      border
      justify="space-between"
      gap={theme.custom.spacing.small}
      style={{
        width: '100%',
        minHeight: 128,
        padding: theme.custom.spacing.medium,
        overflow: 'hidden',
      }}
    >
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={theme.custom.spacing.small}>
          <Typography.Link
            onClick={() => navigate(`/orders/${order.id}/detail`)}
            style={{ fontSize: theme.custom.fontSize.large, fontWeight: 500 }}
          >
            {order.transaction_code}
          </Typography.Link>
          <DynamicTag value={order.status} />
        </Flex>

        <Flex justify="space-between" wrap="wrap" gap={theme.custom.spacing.xsmall}>
          <Typography.Text type="secondary">
            {formatDateTime(order.created_at)}
          </Typography.Text>
          <Typography.Text strong style={{ color: theme.custom.colors.success.default }}>
            {formatCurrencyCompact(order.total_amount)}
          </Typography.Text>
        </Flex>

        <Flex gap={theme.custom.spacing.medium}>
          <Typography.Text type="secondary">
            {t('order.list.totalWasher', { noWashers: order.total_washer || 0 })}
          </Typography.Text>
          <Typography.Text type="secondary">
            {t('order.list.totalDryer', { noDryers: order.total_dryer || 0 })}
          </Typography.Text>
        </Flex>

        {order.status === OrderStatusEnum.WAITING_FOR_PAYMENT && (
          <Flex justify="flex-end" align="center" gap={theme.custom.spacing.small}>
            <Button
              type="text"
              onClick={() => triggerPaymentFailed(order.id)}
              icon={<CloseCircle size={18} />}
              style={{
                color: theme.custom.colors.danger.default,
                backgroundColor: theme.custom.colors.danger.light,
                border: 'none',
              }}
            >
              {t('common.cancel')}
            </Button>

            <Button
              type="text"
              onClick={() => triggerPaymentSuccess(order.id)}
              icon={<CheckCircle size={18} />}
              style={{
                color: theme.custom.colors.success.default,
                backgroundColor: theme.custom.colors.success.light,
              }}
            >
              {t('common.pay')}
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
