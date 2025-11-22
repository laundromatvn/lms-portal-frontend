import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { Store } from '@shared/types/store';

import {
  useListStoreApi,
  type ListStoreResponse,
} from '@shared/hooks/useListStoreApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';

import { StoreSelection } from './StoreSelection';
import { StoreOverview } from './StoreOverview';

export const OverviewPage: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<Store>();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const storeId = searchParams.get('store_id');

  const {
    listStore,
    data: listStoreData,
    loading: listStoreLoading,
  } = useListStoreApi<ListStoreResponse>();

  const handleListStore = () => {
    listStore({ page: 1, page_size: 100 });
  }

  useEffect(() => {
    handleListStore();
  }, []);

  useEffect(() => {
    if (storeId && listStoreData) {
      setSelectedStore(listStoreData?.data?.find((store) => store.id === storeId));
    }
  }, [storeId, listStoreData]);

  return (
    <PortalLayout
      title={selectedStore?.name}
      onTitleClick={selectedStore ? () => navigate(`/stores/${selectedStore.id}/detail`) : undefined}
      onBack={selectedStore ? () => setSelectedStore(undefined) : undefined}
    >
      {!selectedStore && (
        <StoreSelection
          stores={listStoreData?.data || []}
          loading={listStoreLoading}
          onSelectStore={(store) => {
            setSelectedStore(store);
            setSearchParams({ store_id: store.id });
          }}
        />
      )}

      {selectedStore && <StoreOverview store={selectedStore} />}
    </PortalLayout>
  );
};
