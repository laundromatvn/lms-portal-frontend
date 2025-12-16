import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Flex, Skeleton, notification } from 'antd';

import { BillCheck, BillCross } from '@solar-icons/react';

import { type Order } from '@shared/types/Order';

import { OrderStatusEnum } from '@shared/enums/OrderStatusEnum';

import { useTheme } from '@shared/theme/useTheme';

import { useGetOrderApi } from '@shared/hooks/useGetOrderApi';
import { useTriggerPaymentSuccessApi } from '@shared/hooks/useTriggerPaymentSuccessApi';
import { useTriggerPaymentFailedApi } from '@shared/hooks/useTriggerPaymentFailedApi';
import { useSyncUpOrderApi } from '@shared/hooks/useSyncUpOrderApi';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { DetailSection } from './DetailSection';
import { OrderDetailListSection } from './OrderDetailListSection';

export const OrderDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [api, contextHolder] = notification.useNotification();

  const orderId = useParams().id as string;

  const {
    getOrder,
    loading: getOrderLoading,
    error: getOrderError,
    data: getOrderData,
  } = useGetOrderApi();
  const {
    data: triggerPaymentSuccessData,
    error: triggerPaymentSuccessError,
    triggerPaymentSuccess,
  } = useTriggerPaymentSuccessApi();
  const {
    data: triggerPaymentFailedData,
    error: triggerPaymentFailedError,
    triggerPaymentFailed,
  } = useTriggerPaymentFailedApi();
  const {
    data: syncUpOrderData,
    error: syncUpOrderError,
    syncUpOrder,
  } = useSyncUpOrderApi();

  useEffect(() => {
    if (orderId) {
      getOrder(orderId);
    }
  }, []);

  useEffect(() => {
    if (triggerPaymentSuccessData) {
      api.success({
        message: t('messages.triggerPaymentSuccessSuccess'),
      });

      getOrder(getOrderData?.id as string);
    }
  }, [triggerPaymentSuccessData]);

  useEffect(() => {
    if (triggerPaymentFailedData) {
      api.success({
        message: t('messages.triggerPaymentFailedSuccess'),
      });

      getOrder(getOrderData?.id as string);
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
    if (triggerPaymentFailedError) {
      api.error({
        message: t('messages.triggerPaymentFailedError'),
      });
    }
  }, [triggerPaymentFailedError]);

  useEffect(() => {
    if (triggerPaymentSuccessData) {
      getOrder(getOrderData?.id as string);
    }
  }, [triggerPaymentSuccessData]);

  useEffect(() => {
    if (triggerPaymentFailedData) {
      getOrder(getOrderData?.id as string);
    }
  }, [triggerPaymentFailedData]);

  useEffect(() => {
    if (getOrderError) {
      api.error({
        message: t('messages.getOrderError'),
      });
    }
  }, [getOrderError]);

  useEffect(() => {
    if (syncUpOrderData) {
      api.success({
        message: t('messages.syncUpOrderSuccess'),
      });

      getOrder(getOrderData?.id as string);
    }
  }, [syncUpOrderData]);

  useEffect(() => {
    if (syncUpOrderError) {
      api.error({
        message: t('messages.syncUpOrderError'),
      });
    }
  }, [syncUpOrderError]);

  return (
    <PortalLayoutV2
      title={getOrderData?.transaction_code || orderId}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        {getOrderData?.status === OrderStatusEnum.WAITING_FOR_PAYMENT && (
          <Flex
            vertical={isMobile}
            justify="flex-end"
            wrap="wrap"
            gap={theme.custom.spacing.medium}
            style={{ width: '100%' }}
          >
            <Button
              type="text"
              danger
              icon={<BillCross size={18} />}
              style={{
                color: theme.custom.colors.danger.default,
                backgroundColor: theme.custom.colors.danger.light,
              }}
              onClick={() => triggerPaymentFailed(orderId)}
            >
              {t('common.cancel')}
            </Button>

            <Button
              type="text"
              icon={<BillCheck size={18} />}
              style={{
                color: theme.custom.colors.success.default,
                backgroundColor: theme.custom.colors.success.light,
              }}
              onClick={() => triggerPaymentSuccess(orderId)}
            >
              {t('common.pay')}
            </Button>
          </Flex>
        )}

        {getOrderLoading && <Skeleton active />}

        {!getOrderLoading && getOrderData && (
          <>
            <DetailSection order={getOrderData as Order} />
            <OrderDetailListSection order={getOrderData as Order} />
          </>
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
