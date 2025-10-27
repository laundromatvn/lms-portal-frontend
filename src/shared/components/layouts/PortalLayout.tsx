import React, { useState } from 'react';

import { Layout } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { Sider } from '@shared/components/common/Sider';
import { MobileHeader } from '@shared/components/common/MobileHeader';
import { MobileDrawer } from '@shared/components/common/MobileDrawer';
import { MobileFAB } from '@shared/components/common/MobileFAB';

const { Content } = Layout;

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const PortalLayout: React.FC<Props> = ({ children, style }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 80 : 300;

  const desktopLayoutStyle = {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: theme.custom.colors.background.surface,
  };
  const mobileLayoutStyle = {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: theme.custom.colors.background.surface,
    display: 'flex',
    flexDirection: 'column',
  };

  const handleMobileMenuClick = () => {
    setMobileDrawerOpen(true);
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <Layout
      style={isMobile ? mobileLayoutStyle : desktopLayoutStyle}
    >
      {!isMobile && <Sider onCollapseChange={setSidebarCollapsed} />}
      
      {isMobile && (
        <MobileHeader onMenuClick={handleMobileMenuClick} />
      )}

      <Content
        className="portal-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignContent: 'flex-start',
          gap: theme.custom.spacing.medium,
          width: '100%',
          height: isMobile ? 'calc(100vh - 64px)' : 'calc(100vh - 64px - 48px)',
          marginLeft: isMobile ? 0 : sidebarWidth,
          marginTop: isMobile ? 64 : theme.custom.spacing.xxxlarge,
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
