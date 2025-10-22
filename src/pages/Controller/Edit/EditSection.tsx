import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  Form,
  Flex,
  Input,
  InputNumber,
  Select,
  Typography,
  type FormInstance,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Controller } from '@shared/types/Controller';

import { BaseEditSection } from '@shared/components/BaseEditSection';
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
    <BaseEditSection title={t('common.basicInformation')} onSave={() => onSave(form)}>
      <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 600 }}>
        <Form.Item
          label={t('common.controllerName')}
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
            { required: true, message: t('common.totalRelaysIsRequired') },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(new Error(t('common.totalRelaysMustBeGreaterThanZero')));
                }
                return Promise.resolve();
              }
            }]}
        >
          <InputNumber size="large" style={{ width: '100%' }} />
        </Form.Item>

        <Card
          size="small"
          title={t('controller.information')}
          style={{
            border: 'none',
            backgroundColor: theme.custom.colors.info.light,
            marginBottom: theme.custom.spacing.medium,
            marginTop: theme.custom.spacing.medium,
          }}
        >
          <Flex vertical gap={theme.custom.spacing.small}>
            <Typography.Text>{t('controller.thisNumberIsTheTotalActiveRelays')}</Typography.Text>
            <Typography.Text>{t('controller.example', { totalRelays: 8, activeRelays: 4 })}</Typography.Text>
            <Typography.Text>{t('controller.theMachinesWillBeActivatedInTheOrder', { minRelayNumber: 1, maxRelayNumber: 8 })}</Typography.Text>
          </Flex>
        </Card>

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
      </Form>
    </BaseEditSection>
  );
};
