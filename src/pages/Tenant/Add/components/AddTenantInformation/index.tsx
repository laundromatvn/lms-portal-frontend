import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Form,
  Input,
  notification,
} from 'antd';

import {
  useCreateTenantApi,
  type CreateTenantResponse,
} from '@shared/hooks/tenant/useCreateTenantApi';

import { type User } from '@shared/types/user';
import { type Tenant } from '@shared/types/tenant';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  newTenantOwner: User;
  onSave: (tenant: Tenant) => void;
}

export const AddTenantInformation: React.FC<Props> = ({ newTenantOwner, onSave }: Props) => {
  const { t } = useTranslation();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const {
    createTenant,
    data: createTenantData,
    loading: createTenantLoading,
    error: createTenantError,
  } = useCreateTenantApi<CreateTenantResponse>();

  const handleSave = async () => {
    await createTenant({
      name: form.getFieldValue('name'),
      contact_email: form.getFieldValue('contact_email'),
      contact_phone_number: form.getFieldValue('contact_phone_number'),
      contact_full_name: form.getFieldValue('contact_full_name'),
      contact_address: form.getFieldValue('contact_address'),
    });
  }

  useEffect(() => {
    if (createTenantData) {
      onSave(createTenantData);
    }
  }, [createTenantData]);

  useEffect(() => {
    if (createTenantError) {
      api.error({
        message: t('messages.createTenantError'),
      });
    }
  }, [createTenantError]);

  useEffect(() => {
    if (newTenantOwner) {
      form.setFieldsValue({
        contact_email: newTenantOwner.email,
        contact_phone_number: newTenantOwner.phone,
      });
    }
  }, [newTenantOwner]);

  return (
    <BaseEditSection
      title={t('tenant.tenantInformation')}
      saveButtonText={t('common.continue')}
      onSave={handleSave}
      loading={createTenantLoading}
    >
      {contextHolder}

      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%', maxWidth: 600 }}
      >
        <Form.Item
          name="name"
          label={t('common.tenantName')}
          rules={[{ required: true, message: t('messages.tenantNameIsRequired') }]}
          style={{ width: '100%' }}
        >
          <Input size="large" type="text" />
        </Form.Item>

        <Form.Item
          name="contact_email"
          label={t('common.contactEmail')}
          rules={[{ required: true, message: t('messages.contactEmailIsRequired') }]}
          style={{ width: '100%' }}
        >
          <Input size="large" type="email" />
        </Form.Item>

        <Form.Item
          name="contact_phone_number"
          label={t('common.contactPhoneNumber')}
          rules={[
            {
              required: true,
              message: t('messages.contactPhoneNumberIsRequired'),
            }, {
              min: 8,
              message: t('messages.contactPhoneNumberMinLength'),
            }
          ]}
          style={{ width: '100%' }}
        >
          <Input size="large" type="tel" />
        </Form.Item>

        <Form.Item
          name="contact_full_name"
          label={t('common.contactFullName')}
          rules={[
            {
              required: true,
              message: t('messages.contactFullNameIsRequired'),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('contact_full_name') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('messages.contactFullNameError')));
              },
            }),
          ]}
          style={{ width: '100%' }}
        >
          <Input size="large" type="text" />
        </Form.Item>

        <Form.Item
          name="contact_address"
          label={t('common.contactAddress')}
          rules={[{ required: true, message: t('messages.contactAddressIsRequired') }]}
          style={{ width: '100%' }}
        >
          <Input size="large" type="text" />
        </Form.Item>
      </Form>
    </BaseEditSection>
  )
};
