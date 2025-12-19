import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { Store } from '@shared/types/store';

import {
  useListStoreApi,
  type ListStoreResponse,
} from '@shared/hooks/useListStoreApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { StoreSelection } from './components/StoreSelection';
import { StoreOverview } from './components/StoreOverview';
import { MoreFilterDrawer } from './components/MoreFilterDrawer';

export const MobileView: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<Store>();
  const navigate = useNavigate();
  const [moreFilterDrawerOpen, setMoreFilterDrawerOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<{ start_datetime: string; end_datetime: string }>({
    start_datetime: '',
    end_datetime: '',
  });

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
    <PortalLayoutV2
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

      {selectedStore && (
        <StoreOverview
          store={selectedStore}
          onFilterClick={() => setMoreFilterDrawerOpen(true)}
          datetimeFilters={appliedFilters}
        />
      )}

      <MoreFilterDrawer
        open={moreFilterDrawerOpen}
        onClose={() => setMoreFilterDrawerOpen(false)}
        initialFilters={appliedFilters}
        onApplyFilters={(filters: { start_datetime: string; end_datetime: string }) => {
          setAppliedFilters({
            start_datetime: filters.start_datetime || '',
            end_datetime: filters.end_datetime || '',
          });
        }}
      />
    </PortalLayoutV2>
  );
};

