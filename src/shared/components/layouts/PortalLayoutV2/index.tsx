import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Layout } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { Sider } from '@shared/components/common/Sider';
import { MobileDrawer } from '@shared/components/common/MobileDrawer';

import { MainHeader } from './MainHeader';
import { SubHeader } from './SubHeader';

const { Content } = Layout;

const HEADER_HEIGHT = 64;
const SUB_HEADER_HEIGHT = 56;

interface Props {
  children: React.ReactNode;
  title?: string;
  subTitle?: string;
  onTitleClick?: () => void;
  onBack?: () => void;
  style?: React.CSSProperties;
}

export const PortalLayoutV2: React.FC<Props> & {
  MainHeader: typeof MainHeader;
  SubHeader: typeof SubHeader;
} = ({ children, title, onTitleClick, onBack, style }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 80 : 300;

  const handleMobileMenuClick = () => setMobileDrawerOpen(true);
  const handleMobileDrawerClose = () => setMobileDrawerOpen(false);

  const renderDesktopHeader = () => (
    <MainHeader
      title={title}
      onBack={onBack}
      onTitleClick={onTitleClick}
      style={{
        transition: 'margin-left 0.2s ease',
        height: HEADER_HEIGHT,
        flexShrink: 0,
      }}
    />
  );

  const renderMobileHeader = () => (
    <>
      <MainHeader
        title={t('common.washgo247')}
        showLogo
        onTitleClick={handleMobileMenuClick}
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
      {!isMobile && <Sider onCollapseChange={setSidebarCollapsed} />}

      <Layout
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: 'margin-left 0.2s ease',
        }}
      >
        {isMobile ? renderMobileHeader() : renderDesktopHeader()}

        <Content
          className="portal-content"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
            height: '100%',
            padding: theme.custom.spacing.medium,
            backgroundColor: theme.custom.colors.background.surface,
          }}
        >
          {children}
        </Content>
      </Layout>

      {isMobile && <MobileDrawer open={mobileDrawerOpen} onClose={handleMobileDrawerClose} />}
    </Layout>
  );
};

PortalLayoutV2.MainHeader = MainHeader;
PortalLayoutV2.SubHeader = SubHeader;
