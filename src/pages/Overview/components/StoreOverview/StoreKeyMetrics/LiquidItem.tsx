import React from 'react';

import { Flex, Progress, Typography } from 'antd';

import { Liquid } from '@ant-design/plots';

import { useTheme } from '@shared/theme/useTheme';

import { Box } from '@shared/components/Box';

interface Props {
  title: string;
  percent: number;
  description?: string;
}

export const LiquidItem: React.FC<Props> = ({ title, percent, description }) => {
  const theme = useTheme();

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
    <Box
      vertical
      border
      align="flex-start"
      gap={theme.custom.spacing.xlarge}
      style={{
        width: '100%',
        padding: theme.custom.spacing.large,
        overflow: 'hidden',
      }}
    >
      <Typography.Text
        strong
        style={{
          fontSize: theme.custom.fontSize.medium,
          color: theme.custom.colors.text.tertiary,
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {title}
      </Typography.Text>

      <Flex
        align="center"
        justify="center"
        style={{width: '100%'}}
      >
        <Progress
          percent={percent}
          type="circle"
          strokeColor={theme.custom.colors.info.default}
          trailColor={theme.custom.colors.info.light}
        />
      </Flex>

      <Typography.Text
        type="secondary"
        style={{
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {description}
      </Typography.Text>
    </Box>
  );
};
