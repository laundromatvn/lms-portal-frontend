import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { tenantStorage } from '@core/storage/tenantStorage';

import { type Tenant } from '@shared/types/tenant';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

export const TenantMemberListPage: React.FC = () => {
  const isMobile = useIsMobile();

  const tenant = tenantStorage.load();

  return isMobile ? (
    <MobileView tenant={tenant as Tenant} />
  ) : (
    <DesktopView tenant={tenant as Tenant} />
  );
};
