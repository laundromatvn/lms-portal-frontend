import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

import type { Machine } from '@shared/types/machine';

interface Props {
  machine: Machine;
}

export const MachineStatusSection: React.FC<Props> = ({ machine }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileView machine={machine} />;
  }

  return <DesktopView machine={machine} />;
};
