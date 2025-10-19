import React from 'react';

import { Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { Box } from '@shared/components/Box';

interface Props {
  title: string;
  description: string;
  type: 'success' | 'error';
}

export const VerificationMessage: React.FC<Props> = ({ title, description, type }) => {
  const theme = useTheme();

  const primaryColor = (() => {
    switch (type) {
      case 'success':
        return theme.custom.colors.success.default;
      case 'error':
        return theme.custom.colors.danger.default;
    }
  })();

  const lightColor = (() => {
    switch (type) {
      case 'success':
        return theme.custom.colors.success.light;
      case 'error':
        return theme.custom.colors.danger.light;
    }
  })();
  
  return (
    <Box
      vertical
      justify="center"
      align="center"
      gap={theme.custom.spacing.small}
      style={{
        width: '100%',
        maxWidth: 800,
        height: '100%',
        minHeight: 200,
        maxHeight: 400,
        backgroundColor: lightColor,
        border: `1px solid ${primaryColor}`,
        borderRadius: theme.custom.radius.medium,
        padding: theme.custom.spacing.medium,
      }}
    >
      <Typography.Title level={2}>{title}</Typography.Title>
      <Typography.Text>{description}</Typography.Text>
    </Box>
  );
};
