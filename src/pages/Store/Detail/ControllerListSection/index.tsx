import React from 'react';

import { type Store } from '@shared/types/store';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

interface Props {
  store: Store;
}

export const ControllerListSection: React.FC<Props> = ({ store }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileView store={store} />;
  }

  return <DesktopView store={store} />;
};
