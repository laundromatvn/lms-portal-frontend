import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Skeleton } from 'antd';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import {
  useGetStoreApi,
  type GetStoreResponse,
} from '@shared/hooks/useGetStoreApi';

import { type Store } from '@shared/types/store';

import { MobileView } from './MobileView';
import { DesktopView } from './DekstopView';

export const StoreDetailPage: React.FC = () => {
  const isMobile = useIsMobile();

  const storeId = useParams().id;

  const {
    getStore,
    data: storeData,
  } = useGetStoreApi<GetStoreResponse>();

  useEffect(() => {
    if (storeId) {
      getStore(storeId);
    }
  }, [storeId]);

  if (!storeData) {
    return <Skeleton active />;
  }

  return (
    isMobile ? (
      <MobileView
        store={storeData as Store}
      />
    ) : (
      <DesktopView
        store={storeData as Store}
      />
    )
  );
};
