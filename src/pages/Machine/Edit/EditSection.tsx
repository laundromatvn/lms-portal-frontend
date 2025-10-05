import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  type FormInstance,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Machine } from '@shared/types/machine';
import { MachineTypeEnum } from '@shared/enums/MachineTypeEnum';
import { MachineStatusEnum } from '@shared/enums/MachineStatusEnum';

import { Box } from '@shared/components/Box';

interface Props {
  machine: Machine;
  onSave: (form: FormInstance) => void;
}

export const EditSection: React.FC<Props> = ({ machine, onSave }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      id: machine.id,
      name: machine.name,
      machine_type: machine.machine_type,
      base_price: machine.base_price,
      status: machine.status,
      relay_no: machine.relay_no,
      pulse_duration: machine.pulse_duration,
      pulse_value: machine.pulse_value,
    });
  }, [machine]);

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 600 }}>
        <Form.Item
          label={t('common.machineId')}
          name="id"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.machineIdIsRequired') }]}
        >
          <Input size="large" disabled />
        </Form.Item>

        <Form.Item
          label={t('common.relayNo')}
          name="relay_no"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.relayNoIsRequired') }]}
        >
          <Input size="large" disabled />
        </Form.Item>

        <Form.Item
          label={t('common.name')}
          name="name"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.nameIsRequired') }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.pulseDuration')}
          name="pulse_duration"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.pulseDurationIsRequired') }]}
        >
          <InputNumber size="large" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('common.pulseValue')}
          name="pulse_value"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.pulseValueIsRequired') }]}
        >
          <InputNumber size="large" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('common.status')}
          name="status"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.statusIsRequired') }]}
        >
          <Select
            size="large"
            style={{ width: '100%' }}
            options={[
              { label: t('common.active'), value: MachineStatusEnum.ACTIVE },
              { label: t('common.inactive'), value: MachineStatusEnum.INACTIVE },
            ]}
          />
        </Form.Item>

        <Form.Item
          label={t('common.machineType')}
          name="machine_type"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.machineTypeIsRequired') }]}
        >
          <Select
            size="large"
            style={{ width: '100%' }}
            options={[
              { label: t('common.washer'), value: MachineTypeEnum.WASHER },
              { label: t('common.dryer'), value: MachineTypeEnum.DRYER },
            ]}
          />
        </Form.Item>

        <Form.Item
          label={t('common.basePrice')}
          name="base_price"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.basePriceIsRequired') }]}
        >
          <InputNumber size="large" style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item style={{ width: '100%', textAlign: 'right' }}>
          <Button
            type="primary"
            size="large"
            style={{ minWidth: 128 }}
            onClick={() => onSave(form)}
          >
            {t('common.save')}
          </Button>
        </Form.Item>
      </Form>
    </Box>
  );
};
