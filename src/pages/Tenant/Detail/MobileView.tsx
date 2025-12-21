import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Flex,
  notification,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useGetTenantApi,
  type GetTenantResponse,
} from '@shared/hooks/tenant/useGetTenantApi';

import { type Tenant } from '@shared/types/tenant';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { DetailSection } from './components/DetailSection';
import { ContactInformationSection } from './components/ContactInformationSection';

export const MobileView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const tenantId = useParams().id as string;

  const {
    getTenant,
    data: tenantData,
    error: tenantError,
  } = useGetTenantApi<GetTenantResponse>();

  useEffect(() => {
    if (tenantId) {
      getTenant(tenantId);
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantError) {
      api.error({
        message: t('tenant.messages.getTenantError'),
      });
    }
  }, [tenantError]);

  return (
    <PortalLayoutV2
      title={t('tenant.tenantDetail')}
      onBack={() => navigate('/tenants')}
    >
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        <DetailSection tenant={tenantData as Tenant} />
        <ContactInformationSection tenant={tenantData as Tenant} />
      </Flex>
    </PortalLayoutV2>
  );
};
