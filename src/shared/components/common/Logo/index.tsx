import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@shared/theme/useTheme';

import { Typography } from 'antd';

import { Box } from '@shared/components/Box';

interface Props {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  style?: React.CSSProperties;
}

export const Logo: React.FC<Props> = ({ size = 'medium', style }) => {
  const theme = useTheme();

  const navigate = useNavigate();

  const height = (() => {
    switch (size) {
      case 'xsmall':
        return 32;
      case 'small':
        return 40;
      case 'medium':
        return 48;
      case 'large':
        return 56;
      case 'xlarge':
        return 64;
      default:
        return 48;
    }
  })();

  return (
    <Box
      align="center"
      justify="center"
      style={{
        cursor: 'pointer',
        padding: theme.custom.spacing.xxsmall,
        backgroundColor: theme.custom.colors.primary.light,
        ...style,
      }}
      onClick={() => navigate('/')}
    >
      <img src="/logo.png" alt="Logo" style={{ height }} />
      <Typography.Title
        level={2}
        style={{
          margin: 0,
          color: theme.custom.colors.primary.default,
        }}
      >
        WashGo247
      </Typography.Title>
    </Box>
  );
};