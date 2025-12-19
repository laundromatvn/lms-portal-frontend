import React from 'react';

import { type Controller } from '@shared/types/Controller';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

interface Props {
  controller: Controller;
}

export const MachineSection: React.FC<Props> = ({ controller }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileView controller={controller} />;
  }

  return <DesktopView controller={controller} />;
};
