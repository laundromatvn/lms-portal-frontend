import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@shared/theme/useTheme';

import { Layout, Typography } from 'antd';

import { Header } from '@shared/components/common/Header';

const { Content, Footer } = Layout;

const MAX_WIDTH = 1200;

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const DefaultLayout: React.FC<Props> = ({ children, style }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Layout
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: theme.custom.colors.background.light,
      }}
    >
      <Header />

      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignContent: 'flex-start',
          gap: theme.custom.spacing.medium,
          maxWidth: MAX_WIDTH,
          width: '100%',
          height: 'calc(100vh - 64px - 48px)',
          minHeight: 'calc(100vh - 64px - 48px)',
          margin: 'auto',
          padding: theme.custom.spacing.medium,
          overflow: 'hidden',
          ...style,
        }}
      >
        {children}
      </Content>

      <Footer
        style={{
          height: 48,
          textAlign: 'center',
          backgroundColor: theme.custom.colors.background.light,
        }}
      >
        <Typography.Text>{t('messages.allRightsReserved')}</Typography.Text>
      </Footer>
    </Layout>
  );
};