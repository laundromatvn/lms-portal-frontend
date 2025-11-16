import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, Form, type FormInstance, InputNumber } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { Box } from '@shared/components/Box';

interface Props {
  form: FormInstance;
  onChange: (values: Record<string, any>) => void;
}

export const EditPriceSection: React.FC<Props> = ({ form, onChange }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      vertical
      gap={theme.custom.spacing.medium}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Typography.Text strong>{t('common.price')}</Typography.Text>

      <Form
        form={form}
        layout="vertical"
        style={{
          width: '100%',
          height: '100%',
        }}
        onChange={onChange}
      >
        <Form.Item
          label={t('common.basePrice')}
          name="base_price"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.basePriceIsRequired') }]}
        >
          <InputNumber
            size="large"
            style={{ width: '100%' }}
            addonAfter={'đ'}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => {
              const cleaned = value?.replace(/,/g, '') || '';
              return (cleaned === '' ? 0 : Number(cleaned)) as 0;
            }}
            min={0}
            max={1000000000}
            step={1000}
          />
        </Form.Item>

        <Form.Item
          label={t('common.coinValue')}
          name="coin_value"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.coinValueIsRequired') }]}
        >
          <InputNumber
            size="large"
            style={{ width: '100%' }}
            addonAfter={'đ'}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => {
              const cleaned = value?.replace(/,/g, '') || '';
              return (cleaned === '' ? 0 : Number(cleaned)) as 0;
            }}
            min={0}
            max={1000000000}
            step={1000}
          />
        </Form.Item>
      </Form>
    </Box>
  );
};
