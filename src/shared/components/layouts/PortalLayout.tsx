import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Layout } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { Sider } from '@shared/components/common/Sider';
import { MobileDrawer } from '@shared/components/common/MobileDrawer';
import { MainHeader } from '../common/MainHeader';

const { Content } = Layout;

const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 64;

interface Props {
  children: React.ReactNode;
  title?: string;
  onTitleClick?: () => void;
  onBack?: () => void;
  style?: React.CSSProperties;
}

export const PortalLayout: React.FC<Props> = ({ children, title, onTitleClick, onBack, style }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 80 : 300;

  const handleMobileMenuClick = () => {
    setMobileDrawerOpen(true);
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  const getTitle = () => {
    if (title) {
      return title;
    }

    if (isMobile) {
      return t('common.washgo247');
    }

    return undefined;
  };

  const getOnTitleClick = () => {
    if (onTitleClick) {
      return onTitleClick;
    }

    if (isMobile && !title) {
      return handleMobileMenuClick;
    }

    return undefined;
  };

  return (
    <Layout
      style={{
        display: 'flex',
        flexDirection: 'column' as const,
        minHeight: '100vh',
        width: isMobile ? '100vw' : `calc(100vw - ${sidebarWidth}px)`,
        backgroundColor: theme.custom.colors.background.surface,
        ...style,
      }}
    >
      {!isMobile && <Sider onCollapseChange={setSidebarCollapsed} />}

      <MainHeader
        title={getTitle()}
        onTitleClick={getOnTitleClick()}
        onBack={onBack}
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: 'margin-left 0.2s ease',
          height: HEADER_HEIGHT,
        }}
      />

      <Content
        className="portal-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignContent: 'flex-start',
          gap: theme.custom.spacing.medium,
          width: '100%',
          height: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
          marginLeft: isMobile ? 0 : sidebarWidth,
          padding: theme.custom.spacing.medium,
          paddingBottom: theme.custom.spacing.xxxlarge,
          marginBottom: 64,
          backgroundColor: theme.custom.colors.background.surface,
          overflow: 'auto',
          transition: 'margin-left 0.2s ease',
          ...style,
        }}
      >
        {children}
      </Content>

      {isMobile && (
        <MobileDrawer
          open={mobileDrawerOpen}
          onClose={handleMobileDrawerClose}
        />
      )}
    </Layout>
  );
};
