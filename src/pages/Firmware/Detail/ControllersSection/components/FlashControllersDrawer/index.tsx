import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import type { Firmware } from '@shared/types/Firmware';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

interface Props {
  firmware: Firmware | null;
  open: boolean;
  onClose: () => void;
}

export const FlashControllersDrawer: React.FC<Props> = ({
  firmware,
  open,
  onClose,
}: Props) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileView 
      firmware={firmware}
      open={open}
      onClose={onClose}
    />
  ) : (
    <DesktopView 
      firmware={firmware}
      open={open}
      onClose={onClose}
    />
  );
};