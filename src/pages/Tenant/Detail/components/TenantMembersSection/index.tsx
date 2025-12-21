import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { type Tenant } from '@shared/types/tenant';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

export type Props = {
  tenant: Tenant;
}

export const TenantMembersSection: React.FC<Props> = ({ tenant }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileView tenant={tenant} />;
  }

  return (
    <DesktopView tenant={tenant} />
  );
};
