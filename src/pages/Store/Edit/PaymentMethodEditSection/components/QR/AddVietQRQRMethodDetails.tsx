import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Form,
  Input,
  Select,
  Switch,
} from 'antd';

import bankData from '@public/banks.json';

export const AddVietQRQRMethodDetails: React.FC = () => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();

  const handleBankCodeChange = (bankCode: string) => {
    const selectedBank = bankData.find((bank) => bank.bank_code === bankCode);
    if (selectedBank) {
      form.setFieldValue('bank_name', selectedBank.bank_name);
    }
  };

  return (
    <>
      <Form.Item
        name="bank_code"
        label={t('common.bankCode')}
        rules={[
          { required: true, message: `${t('common.bankCode')} is required` },
        ]}>
        <Select
          placeholder={t('common.bankCode')}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          onChange={handleBankCodeChange}
          options={
            bankData.map((bank) => ({
              label: `(${bank.bank_code}) ${bank.bank_name}`,
              value: bank.bank_code,
            }))}
        />
      </Form.Item>

      <Form.Item
        name="bank_name"
        label={t('common.bankName')}
        hidden
      />

      <Form.Item
        name="bank_account_number"
        label={t('common.bankAccountNumber')}
        rules={[
          { required: true, message: `${t('common.bankAccountNumber')} is required` },
        ]}>
        <Input placeholder={t('common.bankAccountNumber')} />
      </Form.Item>

      <Form.Item
        name="bank_account_name"
        label={t('common.bankAccountName')}
        rules={[{ required: true, message: `${t('common.bankAccountName')} is required` }]}
      >
        <Input placeholder={t('common.bankAccountName')} />
      </Form.Item>

      <Form.Item
        name="is_enabled"
        label={t('common.isEnabled')}
        rules={[
          { required: true, message: t('messages.isEnabledIsRequired') },
        ]}
      >
        <Switch />
      </Form.Item>
    </>
  );
};
