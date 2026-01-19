import React from 'react';
import { useTranslation } from 'react-i18next';

import { MainHeader } from './MainHeader';
import { SubHeader } from './SubHeader';

const HEADER_HEIGHT = 64;
const SUB_HEADER_HEIGHT = 56;

interface MobileViewProps {
  title?: string;
  onTitleClick?: () => void;
  onBack?: () => void;
  style?: React.CSSProperties;
  onMobileMenuClick?: () => void;
}

export const MobileView: React.FC<MobileViewProps> = ({ title, onTitleClick, onBack, style, onMobileMenuClick }) => {
  const { t } = useTranslation();

  return (
    <>
      <MainHeader
        title={t('common.washgo247')}
        showLogo
        onTitleClick={onMobileMenuClick}
        style={{ height: HEADER_HEIGHT, flexShrink: 0 }}
      />

      {(title || onBack) && (
        <SubHeader
          title={title}
          onBack={onBack}
          onTitleClick={onTitleClick}
          style={{ height: SUB_HEADER_HEIGHT, flexShrink: 0 }}
        />
      )}
    </>
  );
};
