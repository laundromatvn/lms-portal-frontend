import React from 'react';

import { useTheme } from '@shared/theme/useTheme';

import { Flex, Layout } from 'antd';

import { Logo } from '@shared/components/common/Logo';

const { Header: AntdHeader } = Layout;

const MAX_WIDTH = 1200;

interface Props {
  onMenuClick: () => void;
}

export const MobileHeader: React.FC<Props> = ({ onMenuClick }) => {
  const theme = useTheme();

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
        justify="center"
        align="center"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: MAX_WIDTH,
          padding: `0 ${theme.custom.spacing.medium}px`,
        }}>
        <Logo
          rounded
          size="xsmall"
          style={{ backgroundColor: 'transparent', border: 'none' }}
          titleStyle={{
            color: 'white',
            fontSize: 24,
            fontWeight: 600,
          }}
        />
      </Flex>
    </AntdHeader>
  );
};
