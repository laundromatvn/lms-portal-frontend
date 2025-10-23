import React, { useMemo } from 'react';

import { Flex, Typography } from 'antd';

import { Liquid } from '@ant-design/plots';

import { useTheme } from '@shared/theme/useTheme';

import { Box } from '@shared/components/Box';


interface Props {
  currentValue: number;
  totalValue: number;
  currentLabel?: string;
  totalLabel?: string;
  style?: React.CSSProperties;
  title?: string;
}

export const MachineLiquidItem: React.FC<Props> = ({
  currentValue,
  totalValue,
  currentLabel,
  totalLabel,
  style,
  title,
}) => {
  const theme = useTheme();

  const percent = useMemo(() => Math.round((currentValue / totalValue) * 100) / 100, [currentValue, totalValue]);

  const config = {
    style: {
      outlineBorder: 2,
      outlineDistance: 4,
      waveLength: 64,
      width: 'calc(100% - 8px)',
      height: 'auto',
      maxWidth: 256,
      maxHeight: 256,
    }
  }

  return (
    <Box vertical border align="space-between" justify="center" style={{ width: '100%' }}>
      <Typography.Text>{title}</Typography.Text>

      <Flex vertical align="center" justify="center" style={{ 
        width: '100%', 
        minHeight: 128,
        maxHeight: 256,
        overflow: 'hidden',
      }}>
        <Liquid percent={percent} {...config} />
      </Flex>

      <Flex gap={theme.custom.spacing.small} justify="center" wrap="wrap" style={{ width: '100%', padding: '8px' }}>
        <Typography.Text type="secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
          {currentLabel}: {currentValue}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
          {totalLabel}: {totalValue}
        </Typography.Text>
      </Flex>
    </Box>
  );
};
