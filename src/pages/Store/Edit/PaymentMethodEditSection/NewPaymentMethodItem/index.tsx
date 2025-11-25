import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Card,
  Form,
  Select,
  Flex,
  Typography,
  notification,
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import { type PaymentMethod } from '@shared/types/PaymentMethod';

import { PaymentMethodEnum } from '@shared/enums/PaymentMethodEnum';
import { PaymentProviderEnum } from '@shared/enums/PaymentProviderEnum';

import { AddVietQRQRMethodDetails } from '../components/QR/AddVietQRQRMethodDetails';
import { AddVNPayQRMethodDetails } from '../components/QR/AddVNPAYQRMethodDetails';
import { AddVNPAYCardMethodDetails } from '../components/Card/AddVNPAYCardMethodDetails';

import { buildPaymentMethodDetails } from '../helpers';

interface Props {
  paymentMethods: PaymentMethod[];
  onAdd: (paymentMethod: PaymentMethod) => void;
  onCancel: () => void;
}

export const NewPaymentMethodItem: React.FC<Props> = ({
  paymentMethods,
  onAdd,
  onCancel
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<PaymentProviderEnum | null>(null);

  const handleSubmit = (values: any) => {
    const paymentMethod = values.payment_method;
    const paymentProvider = values.payment_provider;

    if (paymentMethods.some((method) => method.payment_method === paymentMethod && method.payment_provider === paymentProvider)) {
      api.error({
        message: t('common.duplicatePaymentMethodError'),
      });
      return;
    }

    const newPaymentMethod = buildPaymentMethodDetails(paymentMethod, paymentProvider, values);

    if (!newPaymentMethod) {
      api.error({
        message: t('messages.unsupportedPaymentMethodOrProvider'),
      });
      return;
    }

    onAdd(newPaymentMethod);
    form.resetFields();
    onCancel();

    api.success({
      message: t('common.paymentMethodAddedSuccessfully'),
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleValuesChange = (changedFields: any, _: any) => {
    if (changedFields.payment_method) {
      setPaymentMethod(changedFields.payment_method);
    }

    if (changedFields.payment_provider) {
      setPaymentProvider(changedFields.payment_provider);
    };
  };

  const renderPaymentMethodDetails = () => {
    if (!paymentMethod || !paymentProvider) {
      return null;
    }

    if (paymentMethod === PaymentMethodEnum.QR && paymentProvider === PaymentProviderEnum.VIET_QR) {
      return <AddVietQRQRMethodDetails />;
    }

    if (paymentMethod === PaymentMethodEnum.QR && paymentProvider === PaymentProviderEnum.VNPAY) {
      return <AddVNPayQRMethodDetails />;
    }

    if (paymentMethod === PaymentMethodEnum.CARD && paymentProvider === PaymentProviderEnum.VNPAY) {
      return <AddVNPAYCardMethodDetails />;
    }

    return (
      <Typography.Text>
        {t('messages.unsupportedPaymentMethodOrProvider')}
      </Typography.Text>
    )
  };

  return (
    <Card size="small" style={{ width: '100%' }}>
      {contextHolder}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          name="payment_method"
          label={t('common.paymentMethod')}
          rules={[
            { required: true, message: `${t('common.paymentMethod')} is required` },
          ]}
        >
          <Select
            placeholder={t('common.paymentMethod')}
            options={[
              { label: t('common.qr'), value: PaymentMethodEnum.QR },
              { label: t('common.card'), value: PaymentMethodEnum.CARD },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="payment_provider"
          label={t('common.paymentProvider')}
          rules={[
            { required: true, message: `${t('common.paymentProvider')} is required` },
          ]}
        >
          <Select
            placeholder={t('common.paymentProvider')}
            options={[
              { label: t('common.viet_qr'), value: PaymentProviderEnum.VIET_QR },
              { label: t('common.vnpay'), value: PaymentProviderEnum.VNPAY },
            ]}
          />
        </Form.Item>

        {renderPaymentMethodDetails()}

        <Flex justify="end" style={{ width: '100%' }} gap={theme.custom.spacing.medium}>
          <Button onClick={handleCancel}>
            {t('common.cancel')}
          </Button>

          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            {t('common.add')}
          </Button>
        </Flex>
      </Form>
    </Card>
  );
};
