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

import { type Tenant } from '@shared/types/tenant';

import { BaseEditSection } from '@shared/components/BaseEditSection';
import { TenantStatusEnum } from '@shared/enums/TenantStatusEnum';

interface Props {
  tenant: Tenant;
  onSave: (form: FormInstance) => void;
}

export const EditSection: React.FC<Props> = ({ tenant, onSave }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      id: tenant.id,
      name: tenant.name,
      contact_email: tenant.contact_email,
      contact_phone_number: tenant.contact_phone_number,
      contact_full_name: tenant.contact_full_name,
      contact_address: tenant.contact_address,
      status: tenant.status,
    });
  }, [tenant]);
  
  return (
    <BaseEditSection title={t('common.basicInformation')} onSave={() => onSave(form)}>
      <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 600 }}>
        <Form.Item
          label={t('common.tenantId')}
          name="id"
          style={{ width: '100%' }}
        >
          <Input size="large" disabled />
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
              { label: t('common.active'), value: TenantStatusEnum.ACTIVE },
              { label: t('common.inactive'), value: TenantStatusEnum.INACTIVE },
            ]}
          />
        </Form.Item>

        <Form.Item
          label={t('common.name')}
          name="name"
          style={{ width: '100%' }}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.contactEmail')}
          name="contact_email"
          style={{ width: '100%' }}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.contactFullName')}
          name="contact_full_name"
          style={{ width: '100%' }}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.contactPhoneNumber')}
          name="contact_phone_number"
          style={{ width: '100%' }}
          rules={[
            { required: true, message: t('common.contactPhoneNumberIsRequired') },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(new Error(t('common.contactPhoneNumberMustBeGreaterThanZero')));
                }
                return Promise.resolve();
              }
            }]}
        >
          <InputNumber size="large" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </BaseEditSection>
  );
};
