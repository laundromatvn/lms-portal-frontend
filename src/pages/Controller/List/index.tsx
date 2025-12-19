import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';

export const ControllerListPage: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileView />;
  }

  return <DesktopView />;
};
