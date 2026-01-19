import React, { useState } from 'react';

import { Layout } from 'antd';

import { useTheme } from '@shared/theme/useTheme';  

import { MobileDrawer } from '@shared/components/common/MobileDrawer';

import { Header } from './Header';

const { Content } = Layout;

const HEADER_HEIGHT = 64;

interface Props {
  children: React.ReactNode;
  title?: string;
  subTitle?: string;
  onTitleClick?: () => void;
  onBack?: () => void;
  style?: React.CSSProperties;
}

export const MobileView: React.FC<Props> = React.memo(({ children, title, onTitleClick, onBack, style }) => {
  const theme = useTheme();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <Layout
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: theme.custom.colors.background.surface,
        ...style,
      }}
    >
      <Layout
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          paddingBottom: 32,
          transition: 'margin-left 0.2s ease',
          backgroundColor: theme.custom.colors.background.surface,
        }}
      >
        <Header
          title={title}
          onTitleClick={onTitleClick}
          onBack={onBack}
          style={{
            transition: 'margin-left 0.2s ease',
            height: HEADER_HEIGHT,
            flexShrink: 0,
          }}
          onMobileMenuClick={() => setMobileDrawerOpen(true)}
        />

        <Content
          className="portal-content"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
            height: '100%',
            padding: theme.custom.spacing.medium,
          }}
        >
          {children}
        </Content>
      </Layout>

      <MobileDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </Layout>
  );
});
