// AddVNPayQRMethodDetails.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Form,
  Input,
  Switch,
} from 'antd';

export const AddVNPayQRMethodDetails: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Form.Item
        name="merchant_code"
        label={t('common.merchantCode')}
        rules={[
          { required: true, message: t('messages.merchantCodeIsRequired') },
        ]}
      >
        <Input placeholder={t('common.merchantCode')} />
      </Form.Item>

      <Form.Item
        name="terminal_code"
        label={t('common.terminalCode')}
        rules={[
          { required: true, message: t('messages.terminalCodeIsRequired') },
        ]}
      >
        <Input placeholder={t('common.terminalCode')} />
      </Form.Item>

      <Form.Item
        name="init_secret_key"
        label={t('common.initSecretKey')}
        rules={[
          { required: true, message: t('messages.initSecretKeyIsRequired') },
        ]}
      >
        <Input placeholder={t('common.initSecretKey')} />
      </Form.Item>

      <Form.Item
        name="query_secret_key"
        label={t('common.querySecretKey')}
        rules={[
          { required: true, message: t('messages.querySecretKeyIsRequired') },
        ]}
      >
        <Input placeholder={t('common.querySecretKey')} />
      </Form.Item>

      <Form.Item
        name="ipnv3_secret_key"
        label={t('common.ipnv3SecretKey')}
        rules={[
          { required: true, message: t('messages.ipnv3SecretKeyIsRequired') },
        ]}
      >
        <Input placeholder={t('common.ipnv3SecretKey')} />
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
