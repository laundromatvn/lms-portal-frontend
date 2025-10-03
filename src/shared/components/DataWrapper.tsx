import React from 'react';

import { Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

interface Props {
  title: string;
  value?: any;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const DataWrapper: React.FC<Props> = ({ title, value, children, style }: Props) => {
  const theme = useTheme();

  return <Flex vertical gap={theme.custom.spacing.xsmall} style={{ width: '100%', ...style }}>
    <Typography.Text strong>{title}:</Typography.Text>
    {value && <Typography.Text>{value}</Typography.Text>}
    {children}
  </Flex>;
};
