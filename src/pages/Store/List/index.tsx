import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { StoreListTable } from './Table';
import { StoreListStack } from './Stack';

export const StoreListPage: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <StoreListStack />;
  }

  return <StoreListTable />;
};
