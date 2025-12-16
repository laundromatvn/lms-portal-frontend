import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { OrderTableView } from './TableView';
import { OrderListView } from './ListView';

export const OrderListPage: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <OrderListView />;
  }

  return (
    <OrderTableView />
  );
};