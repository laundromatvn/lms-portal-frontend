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

  const getFillColor = (percent: number) => {
    if (percent < 0.2) {
      return theme.custom.colors.danger.default;
    }
    if (percent > 0.5) {
      return theme.custom.colors.success.default;
    }
    return theme.custom.colors.info.default;
  };

  const config = useMemo(() => ({
    percent,
    style: {
      color: getFillColor(percent),
      outlineBorder: 4,
      outlineDistance: 4,
      waveLength: 64,
      width: '100%',
      height: 'auto',
      maxWidth: '200px',
      maxHeight: '200px',
    },
    liquidStyle: ({ percent }: { percent: number }) => ({
      fill: getFillColor(percent),
      stroke: getFillColor(percent),
    })
  }), [percent]);

  return (
    <Box vertical border align="space-between" justify="center" >
      <Typography.Text>{title}</Typography.Text>

      <Flex vertical align="center" justify="center" style={{ 
        width: '100%', 
        minHeight: 128,
        height: 256,
        overflow: 'hidden'
      }}>
        <Liquid {...config} />
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
