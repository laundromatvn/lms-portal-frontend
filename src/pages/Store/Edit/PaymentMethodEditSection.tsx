import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Form,
  Button,
  Typography,
  Input,
  Card,
  Space,
  Select,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import { type Store } from '@shared/types/store';
import { type PaymentMethod } from '@shared/types/PaymentMethod';
import { PaymentMethodEnum } from '@shared/enums/PaymentMethodEnum';

import { Box } from '@shared/components/Box';

import bankData from '@public/banks.json';

interface Props {
  store: Store;
  onChange: (values: any) => void;
}

export const PaymentMethodEditSection: React.FC<Props> = ({ store, onChange }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(store.payment_methods || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm] = Form.useForm();

  useEffect(() => {
    setPaymentMethods(store.payment_methods || []);
  }, [store.payment_methods]);

  const handleAddPaymentMethod = (values: any) => {
    const newPaymentMethod: PaymentMethod = {
      payment_method: values.payment_method,
      details: {
        bank_code: values.bank_code,
        bank_name: bankData.find((bank) => bank.bank_code === values.bank_code)?.bank_name || '',
        bank_account_number: values.bank_account_number,
        bank_account_name: values.bank_account_name,
      },
    };

    const updatedPaymentMethods = [...paymentMethods, newPaymentMethod];
    setPaymentMethods(updatedPaymentMethods);
    
    onChange({
      payment_methods: updatedPaymentMethods,
    });

    addForm.resetFields();
    setShowAddForm(false);
  };

  const handleRemovePaymentMethod = (index: number) => {
    const updatedPaymentMethods = paymentMethods.filter((_, i) => i !== index);
    setPaymentMethods(updatedPaymentMethods);
    
    onChange({
      payment_methods: updatedPaymentMethods,
    });
  };

  const handleCancelAdd = () => {
    addForm.resetFields();
    setShowAddForm(false);
  };

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Typography.Title level={3}>{t('common.paymentMethod')}</Typography.Title>

      {paymentMethods.map((paymentMethod, index) => (
        <Card
          key={index}
          size="small"
          style={{ width: '100%' }}
          actions={[
            <Button
              key="remove"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemovePaymentMethod(index)}
            >
              {t('common.remove')}
            </Button>,
          ]}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Typography.Text strong>{t('common.paymentMethod')}: </Typography.Text>
              <Typography.Text>
                {paymentMethod.payment_method}
              </Typography.Text>
            </div>
            <div>
              <Typography.Text strong>{t('common.bankCode')}: </Typography.Text>
              <Typography.Text>{paymentMethod.details.bank_code}</Typography.Text>
            </div>
            <div>
              <Typography.Text strong>{t('common.bankName')}: </Typography.Text>
              <Typography.Text>{paymentMethod.details.bank_name || '-'}</Typography.Text>
            </div>
            <div>
              <Typography.Text strong>{t('common.bankAccountNumber')}: </Typography.Text>
              <Typography.Text>{paymentMethod.details.bank_account_number}</Typography.Text>
            </div>
            <div>
              <Typography.Text strong>{t('common.bankAccountName')}: </Typography.Text>
              <Typography.Text>{paymentMethod.details.bank_account_name}</Typography.Text>
            </div>
          </Space>
        </Card>
      ))}

      {showAddForm && (
        <Card size="small" style={{ width: '100%' }}>
          <Form
            form={addForm}
            layout="vertical"
            onFinish={handleAddPaymentMethod}
          >
            <Form.Item
              name="payment_method"
              label={t('common.paymentMethod')}
              rules={[{ required: true, message: `${t('common.paymentMethod')} is required` }]}
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
              rules={[{ required: true, message: `${t('common.bankCode')} is required` }]}
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
              rules={[{ required: true, message: `${t('common.bankAccountNumber')} is required` }]}
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

            <Space>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                {t('common.add')}
              </Button>
              <Button onClick={handleCancelAdd}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form>
        </Card>
      )}

      {!showAddForm && (
        <Button
          type="dashed"
          size="large"
          style={{ width: '100%' }}
          icon={<PlusOutlined />}
          onClick={() => setShowAddForm(true)}
        >
          {t('common.addPaymentMethod')}
        </Button>
      )}
    </Box>
  );
};
