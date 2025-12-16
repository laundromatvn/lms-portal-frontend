import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { type Order } from '@shared/types/Order';

import { TableView } from './TableView';
import { ListView } from './ListView';

interface Props {
  order?: Order;
}

export const OrderDetailListSection: React.FC<Props> = ({ order }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ListView order={order} />;
  }

  return <TableView order={order} />;
};
