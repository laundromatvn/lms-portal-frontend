import React, { useEffect } from 'react';
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

import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import { type PaymentMethod } from '@shared/types/PaymentMethod';
import { PaymentMethodEnum } from '@shared/enums/PaymentMethodEnum';

import { PaymentProviderEnum } from '@shared/enums/PaymentProviderEnum';

import { AddVNPAYCardMethodDetails } from '../components/Card/AddVNPAYCardMethodDetails';
import { AddVNPayQRMethodDetails } from '../components/QR/AddVNPAYQRMethodDetails';
import { AddVietQRQRMethodDetails } from '../components/QR/AddVietQRQRMethodDetails';

import { buildPaymentMethodDetails } from '../helpers';

interface Props {
  paymentMethod: PaymentMethod;
  index: number;
  onSave: (index: number, updatedPaymentMethod: PaymentMethod) => void;
  onCancel: (index: number) => void;
}

export const EditPaymentMethodItem: React.FC<Props> = ({
  paymentMethod,
  index,
  onSave,
  onCancel
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  const [api, contextHolder] = notification.useNotification();

  const handleSubmit = (values: any) => {
    const paymentMethod = values.payment_method;
    const paymentProvider = values.payment_provider;

    const updatedPaymentMethod = buildPaymentMethodDetails(paymentMethod, paymentProvider, values);

    if (!updatedPaymentMethod) {
      api.error({
        message: t('messages.unsupportedPaymentMethodOrProvider'),
      });
      return;
    }

    onSave(index, updatedPaymentMethod);

    api.success({
      message: t('common.paymentMethodSavedSuccessfully'),
    });
  };

  const handleCancel = () => {
    onCancel(index);
  };

  const renderPaymentMethodDetails = () => {
    if (!paymentMethod.payment_method || !paymentMethod.payment_provider) {
      return null;
    }

    if (paymentMethod.payment_method === PaymentMethodEnum.QR
      && paymentMethod.payment_provider === PaymentProviderEnum.VIET_QR) {
      return <AddVietQRQRMethodDetails />;
    }

    if (paymentMethod.payment_method === PaymentMethodEnum.QR
      && paymentMethod.payment_provider === PaymentProviderEnum.VNPAY) {
      return <AddVNPayQRMethodDetails />;
    }

    if (paymentMethod.payment_method === PaymentMethodEnum.CARD
      && paymentMethod.payment_provider === PaymentProviderEnum.VNPAY) {
      return <AddVNPAYCardMethodDetails />;
    }

    return (
      <Typography.Text>
        {t('messages.unsupportedPaymentMethodOrProvider')}
      </Typography.Text>
    );
  };

  useEffect(() => {
    form.setFieldsValue({
      payment_method: paymentMethod.payment_method,
      payment_provider: paymentMethod.payment_provider,
      is_enabled: paymentMethod.is_enabled,
      ...paymentMethod.details,
    });
  }, [paymentMethod, form]);

  return (
    <Card size="small" style={{ width: '100%' }}>
      {contextHolder}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
            disabled
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
            disabled
          />
        </Form.Item>

        {renderPaymentMethodDetails()}

        <Flex justify="end" style={{ width: '100%' }} gap={theme.custom.spacing.medium}>
          <Button onClick={handleCancel} icon={<CloseOutlined />}>
            {t('common.cancel')}
          </Button>

          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            {t('common.save')}
          </Button>
        </Flex>
      </Form>
    </Card>
  );
};
