import React, { useState } from 'react';

import { Layout } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { Sider } from '@shared/components/common/Sider';
import { MobileDrawer } from '@shared/components/common/MobileDrawer';
import { MobileFAB } from '@shared/components/common/MobileFAB';
import { MainHeader } from '../common/MainHeader';

const { Content } = Layout;

interface Props {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  style?: React.CSSProperties;
}

export const PortalLayout: React.FC<Props> = ({ children, title, onBack, style }) => {
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

      <div
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: 'margin-left 0.2s ease',
        }}
      >
        <MainHeader
          title={title}
          onBack={onBack}
          style={{
            width: '100%',
            height: 64,
          }}
        />
      </div>

      <Content
        className="portal-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignContent: 'flex-start',
          gap: theme.custom.spacing.medium,
          width: '100%',
          marginLeft: isMobile ? 0 : sidebarWidth,
          marginBottom: theme.custom.spacing.xxxlarge,
          padding: theme.custom.spacing.medium,
          backgroundColor: theme.custom.colors.background.surface,
          overflow: 'auto',
          transition: 'margin-left 0.2s ease',
          ...style,
        }}
      >
        {children}
      </Content>

      {isMobile && (
        <>
          {!mobileDrawerOpen && <MobileFAB onClick={handleMobileMenuClick} />}

          <MobileDrawer
            open={mobileDrawerOpen}
            onClose={handleMobileDrawerClose}
          />
        </>
      )}
    </Layout>
  );
};
