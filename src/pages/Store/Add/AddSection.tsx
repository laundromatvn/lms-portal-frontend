import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Form, Input, Select } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { userStorage } from '@core/storage/userStorage';

import { useListTenantApi, type ListTenantResponse } from '@shared/hooks/useListTenantApi';
import { useCreateStoreApi, type CreateStoreResponse } from '@shared/hooks/useCreateStoreApi';

import { Box } from '@shared/components/Box';
import { tenantStorage } from '@core/storage/tenantStorage';

interface Props {
  onSuccess: () => void;
  onError: () => void;
}

export const AddSection: React.FC<Props> = ({ onSuccess, onError }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  const user = userStorage.load();
  const tenant = tenantStorage.load();
  const [tenantOptions, setTenantOptions] = useState<any[]>([]);

  const {
    data: listTenantData,
    loading: listTenantLoading,
    listTenant,
  } = useListTenantApi<ListTenantResponse>();
  const {
    createStore,
    loading: createStoreLoading,
    data: createStoreData,
    error: createStoreError,
  } = useCreateStoreApi<CreateStoreResponse>();

  const handleSave = () => {
    createStore({
      name: form.getFieldValue('name'),
      contact_phone_number: form.getFieldValue('contact_phone_number'),
      address: form.getFieldValue('address'),
      tenant_id: form.getFieldValue('tenant_id'),
    });
  }

  useEffect(() => {
    if (createStoreData) {
      onSuccess();
    }
  }, [createStoreData]);

  useEffect(() => {
    if (createStoreError) {
      onError();
    }
  }, [createStoreError]);

  useEffect(() => {
    if (listTenantData) {
      setTenantOptions(listTenantData.data.map((item) => ({
        label: item.name,
        value: item.id,
      })) || []);
    }
  }, [listTenantData]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      listTenant({ page: 1, page_size: 100 });
    } else if (tenant) {
      setTenantOptions([{
        label: tenant.name,
        value: tenant.id,
      }]);
      form.setFieldsValue({ tenant_id: tenant.id });
    }
  }, [user, tenant, form]);

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 600 }}>
        <Form.Item
          name="name"
          label={t('common.name')}
          rules={[{ required: true, message: t('messages.nameIsRequired') }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="contact_phone_number"
          label={t('common.phone')}
          rules={[{ required: true, message: t('messages.phoneIsRequired') }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="address"
          label={t('common.address')}
          rules={[{ required: true, message: t('messages.addressIsRequired') }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="tenant_id"
          label={t('common.tenant')}
          rules={[{ required: true, message: t('messages.tenantIsRequired') }]}
        >
          <Select
            size="large"
            options={tenantOptions}
            loading={listTenantLoading}
            disabled={user?.role !== 'admin'} />
        </Form.Item>

        <Form.Item style={{ width: '100%', textAlign: 'right' }}>
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
            style={{ minWidth: 128 }}
          >
            {t('common.save')}
          </Button>
        </Form.Item>
      </Form>
    </Box>
  );
};
