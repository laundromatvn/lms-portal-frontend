import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { TableView } from './TableView';
import { ListView } from './ListView';

export const StoreListPage: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ListView />;
  }

  return <TableView />;
};
