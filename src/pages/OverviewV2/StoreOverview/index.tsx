import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import type { Store } from '@shared/types/store';

import { StoreOverviewMobileView } from './StoreOverviewMobileView';
import { StoreOverviewDesktopView } from './StoreOverviewDesktopView';

interface Props {
  store: Store;
}

export const StoreOverview: React.FC<Props> = ({ store }) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <StoreOverviewMobileView store={store} />
  ) : (
    <StoreOverviewDesktopView store={store} />
  );
};
