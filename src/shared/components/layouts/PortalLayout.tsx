import React, { useState } from 'react';

import { Layout } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { Sider } from '@shared/components/common/Sider';

const { Content } = Layout;

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const PortalLayout: React.FC<Props> = ({ children, style }) => {
  const theme = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 80 : 300;

  return (
    <Layout
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: theme.custom.colors.background.light,
      }}
    >
      <Sider onCollapseChange={setSidebarCollapsed} />

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
          marginLeft: sidebarWidth,
          padding: theme.custom.spacing.medium,
          backgroundColor: theme.custom.colors.background.surface,
          overflow: 'auto',
          transition: 'margin-left 0.2s ease',
          ...style,
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};
