import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import type { Firmware } from '@shared/types/Firmware';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

interface Props {
  firmware: Firmware | null;
}

export const ControllersSection: React.FC<Props> = ({ firmware }: Props) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileView firmware={firmware} />
  ) : (
    <DesktopView firmware={firmware} />
  );
};
