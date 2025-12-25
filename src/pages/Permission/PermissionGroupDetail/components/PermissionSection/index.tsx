import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

import { type PermissionGroup } from '@shared/types/PermissionGroup';

interface Props {
  permissionGroup: PermissionGroup | null;
  loading?: boolean;
}

export const PermissionSection: React.FC<Props> = ({ permissionGroup, loading }) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileView permissionGroup={permissionGroup} loading={loading} />
  ) : (
    <DesktopView permissionGroup={permissionGroup} loading={loading} />
  );
};