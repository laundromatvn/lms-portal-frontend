import React from 'react';

import { type Store } from '@shared/types/store';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { MachineListTableView } from './Table';
import { MachineListStackView } from './Stack';

interface Props {
  store: Store;
}

export const MachineListSection: React.FC<Props> = ({ store }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MachineListStackView store={store} />;
  }

  return <MachineListTableView store={store} />;
};
