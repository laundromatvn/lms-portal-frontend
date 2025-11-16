import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, Form, type FormInstance, Input, Select } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { Box } from '@shared/components/Box';
import { MachineTypeEnum } from '@shared/enums/MachineTypeEnum';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  form: FormInstance;
  onChange: (values: any) => void;
}

export const EditBasicInformationSection: React.FC<Props> = ({ form, onChange }) => {
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
      <Typography.Text strong>{t('common.basicInformation')}</Typography.Text>

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
          label={t('common.name')}
          name="name"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.nameIsRequired') }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.machineType')}
          name="machine_type"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.machineTypeIsRequired') }]}
        >
          <Select size="large" style={{ width: '100%' }}>
            <Select.Option value={MachineTypeEnum.WASHER}>
              <DynamicTag value={MachineTypeEnum.WASHER} />
            </Select.Option>
            <Select.Option value={MachineTypeEnum.DRYER}>
              <DynamicTag value={MachineTypeEnum.DRYER} />
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Box>
  );
};
