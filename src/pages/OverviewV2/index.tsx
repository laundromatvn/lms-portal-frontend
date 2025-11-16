import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Store } from '@shared/types/store';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';

import { StoreSelection } from './StoreSelection';
import { StoreOverview } from './StoreOverview';

export const OverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedStore, setSelectedStore] = useState<Store>();

  return (
    <PortalLayout
      title={selectedStore?.name}
      style={{ justifyContent: 'center' }}
      onBack={selectedStore ? () => setSelectedStore(undefined) : undefined}
    >
      {!selectedStore && <StoreSelection onSelectStore={(store) => setSelectedStore(store)} />}

      {selectedStore && <StoreOverview store={selectedStore} />}
    </PortalLayout>
  );
};
