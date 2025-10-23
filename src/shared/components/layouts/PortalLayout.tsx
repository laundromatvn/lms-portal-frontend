import React, { useState, useEffect } from 'react';

import { Layout } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 80 : 300;

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleMobileMenuClick = () => {
    setMobileDrawerOpen(true);
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: theme.custom.colors.background.surface,
      }}
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
          height: '100vh',
          marginLeft: isMobile ? 0 : sidebarWidth,
          marginTop: isMobile ? theme.custom.spacing.large : theme.custom.spacing.xxxlarge,
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
