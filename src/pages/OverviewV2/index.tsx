import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
          onSelectStore={(store) => setSelectedStore(store)}
        />
      )}

      {selectedStore && <StoreOverview store={selectedStore} />}
    </PortalLayout>
  );
};
