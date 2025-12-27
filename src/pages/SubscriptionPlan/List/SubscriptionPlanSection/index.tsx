import React from 'react';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';

export const SubscriptionPlanSection: React.FC = () => {
  const isMobile = useIsMobile();

  return isMobile ? <MobileView /> : <DesktopView />;
};
