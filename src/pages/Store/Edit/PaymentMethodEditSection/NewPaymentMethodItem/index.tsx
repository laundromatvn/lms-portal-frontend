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

import { AddVietQRQRMethodDetails } from './QR/AddVietQRQRMethodDetails';
import { AddVNPAYCardMethodDetails } from './Card/AddVNPAYCardMethodDetails';

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

    if (paymentMethods.some((method) => method.payment_method === paymentMethod)) {
      api.error({
        message: t('common.duplicatePaymentMethodError'),
      });
      return;
    }

    if (paymentMethod === PaymentMethodEnum.QR && paymentProvider === PaymentProviderEnum.VIET_QR) {
      const bankCode = values.bank_code;
      const bankName = values.bank_name;
      const bankAccountNumber = values.bank_account_number;
      const bankAccountName = values.bank_account_name;

      const newPaymentMethod: PaymentMethod = {
        payment_method: PaymentMethodEnum.QR,
        payment_provider: PaymentProviderEnum.VIET_QR,
        details: {
          bank_code: bankCode,
          bank_name: bankName,
          bank_account_number: bankAccountNumber,
          bank_account_name: bankAccountName,
        },
      };

      onAdd(newPaymentMethod);
    }

    else if (paymentMethod === PaymentMethodEnum.CARD && paymentProvider === PaymentProviderEnum.VNPAY) {
      const merchantCode = values.merchant_code;
      const terminalCode = values.terminal_code;
      const initSecretKey = values.init_secret_key;
      const querySecretKey = values.query_secret_key;
      const ipnv3SecretKey = values.ipnv3_secret_key;

      const newPaymentMethod: PaymentMethod = {
        payment_method: PaymentMethodEnum.CARD,
        payment_provider: PaymentProviderEnum.VNPAY,
        details: {
          merchant_code: merchantCode,
          terminal_code: terminalCode,
          init_secret_key: initSecretKey,
          query_secret_key: querySecretKey,
          ipnv3_secret_key: ipnv3SecretKey,
        },
      };

      onAdd(newPaymentMethod);
    }

    api.success({
      message: t('common.paymentMethodAddedSuccessfully'),
    });

    form.resetFields();
    onCancel();
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
