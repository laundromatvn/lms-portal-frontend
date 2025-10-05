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

import { type Controller } from '@shared/types/Controller';

import { Box } from '@shared/components/Box';
import { ControllerStatusEnum } from '@shared/enums/ControllerStatusEnum';

interface Props {
  controller: Controller;
  onSave: (form: FormInstance) => void;
}

export const EditSection: React.FC<Props> = ({ controller, onSave }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      id: controller.id,
      device_id: controller.device_id,
      name: controller.name,
      total_relays: controller.total_relays,
      status: controller.status,
    });
  }, [controller]);

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 600 }}>
        <Form.Item 
          label={t('common.controllerId')}
          name="id"
          style={{ width: '100%' }}
        >
          <Input size="large" defaultValue={controller.id} disabled />
        </Form.Item>

        <Form.Item
          label={t('common.deviceId')}
          name="device_id"
          style={{ width: '100%' }}
        >
          <Input size="large" defaultValue={controller.device_id} />
        </Form.Item>

        <Form.Item
          label={t('common.name')}
          name="name"
          style={{ width: '100%' }}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.totalRelays')}
          name="total_relays"
          style={{ width: '100%' }}
          rules={[
            {required: true, message: t('common.totalRelaysIsRequired') },
            {validator: (_, value) => {
              if (value < 0) {
                return Promise.reject(new Error(t('common.totalRelaysMustBeGreaterThanZero')));
              }
              return Promise.resolve();
            }}]}
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
              { label: t('common.new'), value: ControllerStatusEnum.NEW },
              { label: t('common.active'), value: ControllerStatusEnum.ACTIVE },
              { label: t('common.inactive'), value: ControllerStatusEnum.INACTIVE },
            ]}
          />
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
