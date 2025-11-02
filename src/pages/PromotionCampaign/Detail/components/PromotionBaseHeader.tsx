import React from 'react';

import { Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

interface Props {
  title: string;
  icon: React.ReactNode;
  style?: React.CSSProperties;
}

export const PromotionBaseHeader: React.FC<Props> = ({ title, icon, style }: Props) => {
  const theme = useTheme();

  return (
    <Flex align="center" gap={theme.custom.spacing.xxsmall} style={{ ...style }}>
      {icon}
      <Typography.Text strong>{title}</Typography.Text>
    </Flex>
  );
};