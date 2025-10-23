import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@shared/theme/useTheme';

import Flag from 'react-world-flags';

import { Flex, Layout, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

import { Logo } from '@shared/components/common/Logo';

const { Header: AntdHeader } = Layout;

const MAX_WIDTH = 1200;

interface Props {
  onMenuClick: () => void;
}

export const MobileHeader: React.FC<Props> = ({ onMenuClick }) => {
  const theme = useTheme();
  const { i18n } = useTranslation();

  const flagStyle = {
    width: 32,
    height: 24,
    borderRadius: 4,
    cursor: 'pointer',
    border: '2px solid #fff',
    objectFit: 'cover' as React.CSSProperties['objectFit'],
  };

  return (
    <AntdHeader
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        padding: 0,
        margin: 0,
        backgroundColor: theme.custom.colors.primary.default,
        height: 64,
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
      <Flex
        justify="space-between"
        align="center"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: MAX_WIDTH,
          padding: `0 ${theme.custom.spacing.medium}px`,
        }}>

        <Flex
          justify="flex-start"
          align="center"
          style={{
            height: '100%',
          }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onMenuClick}
            style={{
              color: 'white',
              fontSize: '18px',
              height: '100%',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </Flex>

        <Flex
          justify="center"
          align="center"
          style={{
            height: '100%',
          }}>
          <Logo size="small" />
        </Flex>

        <Flex
          justify="flex-end"
          align="center"
          gap={theme.custom.spacing.xsmall}
          style={{
            height: '100%',
          }}>
          <Flag
            code="vn"
            style={{
              ...flagStyle,
              border: i18n.language === 'vn' ? '2px solid #fff' : 'none',
            }}
            onClick={() => {
              i18n.changeLanguage('vn');
            }} />
          <Flag
            code="gb"
            style={{
              ...flagStyle,
              border: i18n.language === 'en' ? '2px solid #fff' : 'none',
            }}
            onClick={() => {
              i18n.changeLanguage('en');
            }} />
        </Flex>
      </Flex>
    </AntdHeader>
  );
};
