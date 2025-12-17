import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { ListView } from './ListView';
import { TableView } from './TableView';

export const ControllerListPage: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ListView />;
  }

  return <TableView />;
};
