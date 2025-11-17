import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Flex, 
  Skeleton,
  notification,
  type FormInstance,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Tenant } from '@shared/types/tenant';

import {
  useGetTenantApi,
  type GetTenantResponse,
} from '@shared/hooks/useGetTenantApi';
import {
  useUpdateTenantApi,
  type UpdateTenantResponse,
} from '@shared/hooks/useUpdateTenantApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import { EditSection } from './EditSection';

export const TenantEditPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const tenantId = useParams().id as string;

  const {
    getTenant,
    data: tenantData,
    loading: tenantLoading,
    error: tenantError,
  } = useGetTenantApi<GetTenantResponse>();
  const {
    updateTenant,
    data: updateTenantData,
    loading: updateTenantLoading,
    error: updateTenantError,
  } = useUpdateTenantApi<UpdateTenantResponse>();

  const onSave = (form: FormInstance) => {
    updateTenant(
      tenantId,
      {
        name: form.getFieldValue('name'),
        status: form.getFieldValue('status'),
        contact_email: form.getFieldValue('contact_email'),
        contact_phone_number: form.getFieldValue('contact_phone_number'),
        contact_full_name: form.getFieldValue('contact_full_name'),
        contact_address: form.getFieldValue('contact_address'),
      }
    );
  }

  useEffect(() => {
    if (tenantError) {
      api.error({
        message: t('messages.getTenantError'),
      });
    }
  }, [tenantError]);

  useEffect(() => {
    if (updateTenantError) {
      api.error({
        message: t('messages.updateTenantError'),
      });
    }
  }, [updateTenantError]);

  useEffect(() => {
    if (updateTenantData) {
      api.success({
        message: t('messages.updateTenantSuccess'),
      });

      navigate(`/tenants/profile`);
    }
  }, [updateTenantData]);

  useEffect(() => {
    if (tenantId) {
      getTenant(tenantId);
    }
  }, [tenantId]);

  return (
    <PortalLayout title={tenantData?.name} onBack={() => navigate(-1)}>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        {tenantLoading && <Skeleton active />}

        {!tenantLoading && tenantData && (
          <EditSection
            tenant={tenantData as Tenant}
            onSave={onSave}
          />
        )}
      </Flex>
    </PortalLayout>
  );
};
