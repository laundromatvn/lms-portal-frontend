import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

interface Props {
  children: React.ReactNode;
  title?: string;
  subTitle?: string;
  onTitleClick?: () => void;
  onBack?: () => void;
  style?: React.CSSProperties;
}

export const PortalLayoutV2: React.FC<Props> = (props) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileView {...props} />
  ) : (
    <DesktopView {...props} />
  );
};
