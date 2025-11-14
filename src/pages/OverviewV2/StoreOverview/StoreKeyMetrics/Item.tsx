import React from 'react';

import { Flex, Typography } from 'antd';

import { CheckCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { Box } from '@shared/components/Box';

interface Props {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
}

export const StoreKeyMetricsItem: React.FC<Props> = ({ title, value, description, icon }) => {
  const theme = useTheme();

  return (
    <Box
      border
      justify="space-between"
      align="center"
      gap={theme.custom.spacing.xlarge}
      style={{
        width: '100%',
        padding: theme.custom.spacing.large,
      }}
    >
      <Flex vertical gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
        <Typography.Text
          strong
          style={{
            fontSize: theme.custom.fontSize.medium,
            color: theme.custom.colors.text.tertiary,
          }}
        >
          {title}
        </Typography.Text>

        <Typography.Text
          strong
          style={{
            fontSize: theme.custom.fontSize.xxlarge,
            color: theme.custom.colors.success.default,
          }}
        >
          {value}
        </Typography.Text>

        <Typography.Text type="secondary">{description}</Typography.Text>
      </Flex>

      <Box
        style={{
          padding: theme.custom.spacing.xsmall,
          borderRadius: theme.custom.radius.medium,
          color: theme.custom.colors.info.default,
          backgroundColor: theme.custom.colors.info.light,
        }}
      >
        {icon || <CheckCircle weight="BoldDuotone" size={32} />}
      </Box>
    </Box>
  );
};
