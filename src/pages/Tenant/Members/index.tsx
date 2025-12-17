import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { TenantMemberTableView } from './TableView';
import { TenantMemberListView } from './ListView';

export const TenantMemberListPage: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <TenantMemberListView />;
  }

  return (
    <TenantMemberTableView />
  );
};
