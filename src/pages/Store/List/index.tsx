import React, { useEffect } from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import type { PortalStoreAccess } from '@shared/types/access/PortalStore';

import { useGetAccessApi } from '@shared/hooks/access/useGetAccess';

import { StoreListTable } from './Table';
import { StoreListStack } from './Stack';

export const StoreListPage: React.FC = () => {
  const isMobile = useIsMobile();

  const {
    getAccess,
    data: accessData,
  } = useGetAccessApi();

  useEffect(() => {
    getAccess('portal_store');
  }, [getAccess]);

  if (isMobile) {
    return <StoreListStack access={accessData as unknown as PortalStoreAccess} />;
  }

  return <StoreListTable access={accessData as unknown as PortalStoreAccess} />;
};
