import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Skeleton } from 'antd';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import {
  useGetStoreApi,
  type GetStoreResponse,
} from '@shared/hooks/useGetStoreApi';

import { type Store } from '@shared/types/store';

import { useGetAccessApi } from '@shared/hooks/access/useGetAccess';

import type { PortalStoreAccess } from '@shared/types/access/PortalStore';

import { StoreDetailMobileView } from './MobileView';
import { StoreDetailDesktopView } from './DekstopView';

export const StoreDetailPage: React.FC = () => {
  const isMobile = useIsMobile();

  const storeId = useParams().id;

  const {
    getStore,
    data: storeData,
  } = useGetStoreApi<GetStoreResponse>();

  const {
    getAccess,
    data: accessData,
  } = useGetAccessApi<PortalStoreAccess>();


  useEffect(() => {
    if (storeId) {
      getStore(storeId);
    }
  }, [storeId]);

  useEffect(() => {
    getAccess('portal_store');
  }, [getAccess]);

  if (!storeData || !accessData) {
    return <Skeleton active />;
  }

  return (
    isMobile ? (
      <StoreDetailMobileView
        store={storeData as Store}
        portalStoreAccess={accessData as PortalStoreAccess}
      />
    ) : (
      <StoreDetailDesktopView
        store={storeData as Store}
        portalStoreAccess={accessData as PortalStoreAccess}
      />
    )
  );
};
