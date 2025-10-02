import React from 'react';

import { useTheme } from '@shared/theme/useTheme';

import { Layout } from 'antd';

const { Content } = Layout;

const MAX_WIDTH = 1200;

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const CenteredLayout: React.FC<Props> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <Layout 
      style={{ 
        minHeight: '100vh', 
        width: '100vw',
        backgroundColor: theme.custom.colors.background.light,
      }}
    >
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          gap: theme.custom.spacing.medium,
          maxWidth: MAX_WIDTH,
          width: '100%',
          margin: 'auto',
          padding: theme.custom.spacing.medium,
          ...style,
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};