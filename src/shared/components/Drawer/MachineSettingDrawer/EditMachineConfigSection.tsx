import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, Form, type FormInstance, InputNumber } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { Box } from '@shared/components/Box';

interface Props {
  form: FormInstance;
  onChange: (values: any) => void;
}

export const EditMachineConfigSection: React.FC<Props> = ({ form, onChange }) => {
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
      <Typography.Text strong>{t('common.config')}</Typography.Text>

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
          label={t('common.pulseDuration')}
          name="pulse_duration"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.pulseDurationIsRequired') }]}
        >
          <InputNumber size="large" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('common.pulseInterval')}
          name="pulse_interval"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.pulseIntervalIsRequired') }]}
        >
          <InputNumber size="large" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Box>
  );
};

