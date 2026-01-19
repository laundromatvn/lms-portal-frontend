import React from 'react';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

interface Props {
  title?: string;
  onTitleClick?: () => void;
  onBack?: () => void;
  style?: React.CSSProperties;
  onMobileMenuClick?: () => void;
};

export const Header: React.FC<Props> = React.memo(({ title, onTitleClick, onBack, style, onMobileMenuClick }) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileView 
      title={title}
      onTitleClick={onTitleClick}
      onBack={onBack}
      style={style}
      onMobileMenuClick={onMobileMenuClick}
    />
  ) : (
    <DesktopView
      title={title}
      onTitleClick={onTitleClick}
      onBack={onBack}
      style={style}
    />
  );
});
