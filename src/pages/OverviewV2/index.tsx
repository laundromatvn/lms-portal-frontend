import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Typography,
} from 'antd';

import type { Store } from '@shared/types/store';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { StoreSelection } from './StoreSelection';
import { StoreOverview } from './StoreOverview';

export const OverviewPage: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<Store>();

  return (
    <PortalLayout>
      <Flex vertical gap="large" style={{ width: '100%' }}>
        {!selectedStore && <StoreSelection onSelectStore={(store) => setSelectedStore(store)} />}

        {selectedStore && <StoreOverview store={selectedStore} onBack={() => setSelectedStore(undefined)} />}
      </Flex>
    </PortalLayout>
  );
};
