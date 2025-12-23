import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

import type { Store } from '@shared/types/store';

interface Props {
  store: Store;
  filters: Record<string, any>;
}

export const MachineStatusOverview: React.FC<Props> = ({ store, filters }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileView store={store} filters={filters} />;
  }

  return <DesktopView store={store} filters={filters} />;
};
