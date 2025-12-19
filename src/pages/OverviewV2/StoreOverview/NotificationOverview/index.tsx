import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

export const NotificationOverview: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileView />;
  }

  return <DesktopView />;
};
