import React from 'react';

import { Flex, Tooltip, Typography } from 'antd';

import {
  InfoCircle
} from '@solar-icons/react'

import { useTheme } from '@shared/theme/useTheme';

import { Box } from '@shared/components/Box';

interface Props {
  title: string;
  value: number | string;
  unit?: string;
  description?: string;
  style?: React.CSSProperties;
  valueTextStyle?: React.CSSProperties;
}

export const KeyMetricItem: React.FC<Props> = ({ title, value, unit, description, style, valueTextStyle }) => {
  const theme = useTheme();

  return (
    <Box
      vertical
      border
      justify="space-between"
      style={{
        width: 240,
        height: 128,
        backgroundColor: theme.custom.colors.background.surface,
        ...style,
      }}
    >
      <Flex gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
        <Typography.Text
          style={{
            textAlign: 'left',
            color: theme.custom.colors.text.secondary,
          }}
        >
          {title} {unit && `(${unit})`}
        </Typography.Text>

        <Tooltip title={description}>
          <InfoCircle
            size={16}
            color={theme.custom.colors.text.secondary}
          />
        </Tooltip>
      </Flex>

      <Flex justify="flex-end" align="center" style={{ width: '100%' }}>
        
          <Typography.Text
            style={{
              fontSize: theme.custom.fontSize.xxxlarge,
              color: theme.custom.colors.text.primary,
              ...valueTextStyle,
            }}
          >
            {value}
          </Typography.Text>
      </Flex>
    </Box>
  )
};
