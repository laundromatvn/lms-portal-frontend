import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Store } from '@shared/types/store';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';

import { StoreSelection } from './StoreSelection';
import { StoreOverview } from './StoreOverview';

export const OverviewPage: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<Store>();
  const navigate = useNavigate();

  return (
    <PortalLayout
      title={selectedStore?.name}
      onTitleClick={selectedStore ? () => navigate(`/stores/${selectedStore.id}/detail`) : undefined}
      style={{ justifyContent: 'center' }}
      onBack={selectedStore ? () => setSelectedStore(undefined) : undefined}
    >
      {!selectedStore && <StoreSelection onSelectStore={(store) => setSelectedStore(store)} />}

      {selectedStore && <StoreOverview store={selectedStore} />}
    </PortalLayout>
  );
};
