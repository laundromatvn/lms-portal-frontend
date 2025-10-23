import React from 'react';

import { useTheme } from '@shared/theme/useTheme';

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

        {/* Minimal Logo on Left */}
        <Flex
          justify="flex-start"
          align="center"
          style={{
            height: '100%',
          }}>
          <Logo minimal rounded size="xsmall" />
        </Flex>

        {/* Menu Button on Right */}
        <Flex
          justify="flex-end"
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
      </Flex>
    </AntdHeader>
  );
};
