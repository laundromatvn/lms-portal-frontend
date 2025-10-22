import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Flex, Popconfirm, Skeleton, Typography, notification } from 'antd';

import { ArrowLeft, BillCheck, BillCross } from '@solar-icons/react';

import { type Order } from '@shared/types/Order';

import { useTheme } from '@shared/theme/useTheme';

import { useGetOrderApi } from '@shared/hooks/useGetOrderApi';
import { useTriggerPaymentSuccessApi } from '@shared/hooks/useTriggerPaymentSuccessApi';
import { useTriggerPaymentFailedApi } from '@shared/hooks/useTriggerPaymentFailedApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';

import { DetailSection } from './DetailSection';
import { OrderDetailListSection } from './OrderDetailListSection';

export const OrderDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

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
    loading: triggerPaymentSuccessLoading,
    error: triggerPaymentSuccessError,
    triggerPaymentSuccess,
  } = useTriggerPaymentSuccessApi();
  const {
    data: triggerPaymentFailedData,
    loading: triggerPaymentFailedLoading,
    error: triggerPaymentFailedError,
    triggerPaymentFailed,
  } = useTriggerPaymentFailedApi();

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

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('common.orderDetail')}</Typography.Title>

        <LeftRightSection
          left={(
            <Button
              type="link"
              icon={<ArrowLeft size={18} />}
              onClick={() => navigate(-1)}
            >
              {t('common.back')}
            </Button>
          )}
          right={(
            <Flex gap={theme.custom.spacing.medium}>
              <Popconfirm
                title={t('common.pay')}
                onConfirm={() => triggerPaymentSuccess(orderId)}
                onCancel={() => triggerPaymentFailed(orderId)}
                okText={t('common.confirm')}
                cancelText={t('common.cancel')}
              >
                <Button
                  type="default"
                  icon={<BillCheck size={18} />}
                  style={{
                    color: theme.custom.colors.success.default,
                    backgroundColor: theme.custom.colors.background.light,
                    borderColor: theme.custom.colors.success.default,
                  }} >
                  {t('common.pay')}
                </Button>
              </Popconfirm>

              <Popconfirm
                title={t('common.cancelPayment')}
                onConfirm={() => triggerPaymentFailed(orderId)}
                onCancel={() => triggerPaymentFailed(orderId)}
                okText={t('common.confirm')}
                cancelText={t('common.cancel')}
              >
                <Button
                  type="default"
                  danger
                  icon={<BillCross size={18} />}
                  style={{
                    color: theme.custom.colors.danger.default,
                    backgroundColor: theme.custom.colors.background.light,
                    borderColor: theme.custom.colors.danger.default,
                  }}
                >
                  {t('common.cancelPayment')}
                </Button>
              </Popconfirm>
            </Flex>
          )}
        />

        {getOrderLoading && <Skeleton active />}

        {!getOrderLoading && getOrderData && (
          <>
            <DetailSection order={getOrderData as Order} />
            <OrderDetailListSection order={getOrderData as Order} />
          </>
        )}
      </Flex>
    </PortalLayout>
  );
};
