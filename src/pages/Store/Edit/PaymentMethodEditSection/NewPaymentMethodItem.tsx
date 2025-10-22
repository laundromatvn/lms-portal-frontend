import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Card, Form, Input, Select, Flex } from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import { type PaymentMethod } from '@shared/types/PaymentMethod';

import { PaymentMethodEnum } from '@shared/enums/PaymentMethodEnum';

import bankData from '@public/banks.json';

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

  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const isDuplicateWithExisting = paymentMethods.some(
      (existingMethod) =>
        existingMethod.payment_method === values.payment_method &&
        existingMethod.details.bank_code === values.bank_code &&
        existingMethod.details.bank_account_number === values.bank_account_number
    );

    if (isDuplicateWithExisting) {
      form.setFields([
        {
          name: 'payment_method',
          errors: [t('common.duplicatePaymentMethodError')],
        },
        {
          name: 'bank_code',
          errors: [t('common.duplicatePaymentMethodError')],
        },
        {
          name: 'bank_account_number',
          errors: [t('common.duplicatePaymentMethodError')],
        },
      ]);
      return;
    }

    const newPaymentMethod: PaymentMethod = {
      payment_method: values.payment_method,
      details: {
        bank_code: values.bank_code,
        bank_name: bankData.find((bank) => bank.bank_code === values.bank_code)?.bank_name || '',
        bank_account_number: values.bank_account_number,
        bank_account_name: values.bank_account_name,
      },
    };

    onAdd(newPaymentMethod);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Card size="small" style={{ width: '100%' }}>
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
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();

                const formValues = form.getFieldsValue();
                const isDuplicate = paymentMethods.some(
                  (existingMethod) =>
                    existingMethod.payment_method === value &&
                    existingMethod.details.bank_code === formValues.bank_code &&
                    existingMethod.details.bank_account_number === formValues.bank_account_number
                );

                if (isDuplicate) {
                  return Promise.reject(new Error(t('common.duplicatePaymentMethodError')));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Select
            placeholder={t('common.paymentMethod')}
            options={[
              { label: t('common.qr'), value: PaymentMethodEnum.QR },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="bank_code"
          label={t('common.bankCode')}
          rules={[
            { required: true, message: `${t('common.bankCode')} is required` },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();

                const formValues = form.getFieldsValue();
                const isDuplicate = paymentMethods.some(
                  (existingMethod) =>
                    existingMethod.payment_method === formValues.payment_method &&
                    existingMethod.details.bank_code === value &&
                    existingMethod.details.bank_account_number === formValues.bank_account_number
                );

                if (isDuplicate) {
                  return Promise.reject(new Error(t('common.duplicatePaymentMethodError')));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Select
            placeholder={t('common.bankCode')}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={
              bankData.map((bank) => ({
                label: `(${bank.bank_code}) ${bank.bank_name}`,
                value: bank.bank_code,
              }))}
          />
        </Form.Item>

        <Form.Item
          name="bank_account_number"
          label={t('common.bankAccountNumber')}
          rules={[
            { required: true, message: `${t('common.bankAccountNumber')} is required` },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();

                const formValues = form.getFieldsValue();
                const isDuplicate = paymentMethods.some(
                  (existingMethod) =>
                    existingMethod.payment_method === formValues.payment_method &&
                    existingMethod.details.bank_code === formValues.bank_code &&
                    existingMethod.details.bank_account_number === value
                );

                if (isDuplicate) {
                  return Promise.reject(new Error(t('common.duplicatePaymentMethodError')));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input placeholder={t('common.bankAccountNumber')} />
        </Form.Item>

        <Form.Item
          name="bank_account_name"
          label={t('common.bankAccountName')}
          rules={[{ required: true, message: `${t('common.bankAccountName')} is required` }]}
        >
          <Input placeholder={t('common.bankAccountName')} />
        </Form.Item>

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
