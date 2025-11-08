import React from 'react';

import { type Store } from '@shared/types/store';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { ControllerListTableView } from './Table';
import { ControllerListStackView } from './Stack';

interface Props {
  store: Store;
}

export const ControllerListSection: React.FC<Props> = ({ store }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ControllerListStackView store={store} />;
  }

  return <ControllerListTableView store={store} />;
};
