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

import { type Store } from '@shared/types/store';
import { StoreStatusEnum } from '@shared/enums/StoreStatusEnum';

import { Box } from '@shared/components/Box';

interface Props {
  store: Store;
  onSave: (form: FormInstance) => void;
}

export const EditSection: React.FC<Props> = ({ store, onSave }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      id: store.id,
      name: store.name,
      address: store.address,
      contact_phone_number: store.contact_phone_number,
      tenant_id: store.tenant_id,
      status: store.status,
    });
  }, [store]);

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 600 }}>
        <Form.Item
          label={t('common.storeId')}
          name="id"
          style={{ width: '100%' }}
          rules={[ { required: true, message: t('common.storeIdIsRequired') }]}
        >
          <Input size="large" disabled />
        </Form.Item>

        <Form.Item
          label={t('common.name')}
          name="name"
          style={{ width: '100%' }}
          rules={[ { required: true, message: t('common.nameIsRequired') }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.address')}
          name="address"
          style={{ width: '100%' }}
          rules={[ { required: true, message: t('common.addressIsRequired') }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.contactPhoneNumber')}
          name="contact_phone_number"
          style={{ width: '100%' }}
          rules={[
            { required: true, message: t('common.contactPhoneNumberIsRequired') },
          ]}
        >
          <Input size="large" type="number" />
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
              { label: t('common.active'), value: StoreStatusEnum.ACTIVE },
              { label: t('common.inactive'), value: StoreStatusEnum.INACTIVE },
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
