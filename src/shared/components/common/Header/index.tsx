import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@shared/theme/useTheme';

import Flag from 'react-world-flags';

import { Flex, Layout } from 'antd';

import { Logo } from '@shared/components/common/Logo';

const { Header: AntdHeader } = Layout;

const MAX_WIDTH = 1200;

export const Header: React.FC = () => {
  const theme = useTheme();

  const { i18n } = useTranslation();

  const flagStyle = {
    width: 54,
    height: 36,
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
        }}>

        <Flex
          justify="flex-start"
          align="center"
          style={{
            width: '100%',
            height: '100%',
          }}>
          <Logo size="small" />
        </Flex>

        <Flex
          justify="flex-end"
          align="center"
          gap={theme.custom.spacing.xsmall}
          style={{
            width: '100%',
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