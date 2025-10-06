import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Flex, Skeleton, Typography, notification } from 'antd';

import { type Order } from '@shared/types/Order';

import { useTheme } from '@shared/theme/useTheme';

import { useGetOrderApi } from '@shared/hooks/useGetOrderApi';
import { useTriggerPaymentSuccessApi } from '@shared/hooks/useTriggerPaymentSuccessApi';
import { useTriggerPaymentFailedApi } from '@shared/hooks/useTriggerPaymentFailedApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DetailSection } from './DetailSection';

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
          left={null}
          right={(
            <Flex gap={theme.custom.spacing.medium}>
              <Button
                type="primary"
                size="large"
                onClick={() => triggerPaymentSuccess(getOrderData?.id as string)}
                style={{
                  color: theme.custom.colors.success.light,
                  backgroundColor: theme.custom.colors.success.default,
                  borderColor: theme.custom.colors.success.default,
                }}
                loading={triggerPaymentSuccessLoading}
              >
                {t('common.testTriggerPaymentSuccess')}
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => triggerPaymentFailed(getOrderData?.id as string)}
                danger
                loading={triggerPaymentFailedLoading}
              >
                {t('common.testTriggerPaymentFailed')}
              </Button>
            </Flex>
          )}
        />

        {getOrderLoading && <Skeleton active />}

        {!getOrderLoading && getOrderData && (
          <>
            <DetailSection order={getOrderData as Order} />
          </>
        )}
      </Flex>
    </PortalLayout>
  );
};
