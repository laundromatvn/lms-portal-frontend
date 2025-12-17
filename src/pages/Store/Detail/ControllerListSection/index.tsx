import React from 'react';

import { type Store } from '@shared/types/store';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { TableView } from './TableView';
import { ListView } from './ListView';

interface Props {
  store: Store;
}

export const ControllerListSection: React.FC<Props> = ({ store }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ListView store={store} />;
  }

  return <TableView store={store} />;
};
