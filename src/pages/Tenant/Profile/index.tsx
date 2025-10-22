import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Skeleton, Typography, notification } from 'antd';

import { tenantStorage } from '@core/storage/tenantStorage';

import { type Tenant } from '@shared/types/tenant';

import { useTheme } from '@shared/theme/useTheme';

import { useGetTenantApi } from '@shared/hooks/useGetTenantApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import { DetailSection } from './DetailSection';

export const TenantProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const localTenant = tenantStorage.load();
  const [api, contextHolder] = notification.useNotification();

  const {
    getTenant,
    loading: getTenantLoading,
    error: getTenantError,
    data: getTenantData,
  } = useGetTenantApi();

  useEffect(() => {
    if (localTenant) {
      getTenant(localTenant.id as string);
    }
  }, []);

  useEffect(() => {
    if (getTenantData) {
      tenantStorage.save(getTenantData);
    }
  }, [getTenantData]);

  useEffect(() => {
    if (getTenantError) {
      api.error({
        message: t('messages.getTenantError'),
      });
    }
  }, [getTenantError]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('navigation.tenantProfile')}</Typography.Title>

        {getTenantLoading && <Skeleton active />}

        {!getTenantLoading && getTenantData && (
          <>
            <DetailSection tenant={getTenantData as Tenant} />
          </>
        )}
      </Flex>
    </PortalLayout>
  );
};
