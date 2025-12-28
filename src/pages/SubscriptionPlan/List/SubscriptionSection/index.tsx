import React from 'react';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';

export const SubscriptionSection: React.FC = () => {
  const isMobile = useIsMobile();

  return isMobile ? <MobileView /> : <DesktopView />;
};
