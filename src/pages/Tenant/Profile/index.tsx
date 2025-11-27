import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, Skeleton, notification } from 'antd';

import { tenantStorage } from '@core/storage/tenantStorage';

import { type Tenant } from '@shared/types/tenant';

import { useTheme } from '@shared/theme/useTheme';

import { useGetTenantApi } from '@shared/hooks/useGetTenantApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { DetailSection } from './DetailSection';

export const TenantProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

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
    <PortalLayoutV2 title={t('navigation.tenantProfile')} onBack={() => navigate(-1)}>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        {getTenantLoading && <Skeleton active />}

        {!getTenantLoading && getTenantData && (
          <>
            <DetailSection tenant={getTenantData as Tenant} />
          </>
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
