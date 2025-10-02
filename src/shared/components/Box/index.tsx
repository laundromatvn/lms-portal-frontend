import React from 'react';

import { useTheme } from '@shared/theme/useTheme';

import { Flex } from 'antd';

interface Props {
  children: React.ReactNode;
  vertical?: boolean;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: number;
  style?: React.CSSProperties;
  border?: boolean;
  onClick?: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

export const Box: React.FC<Props> = ({
  children,
  vertical = false,
  align = 'flex-start',
  justify = 'flex-start',
  gap,
  style,
  border = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const theme = useTheme();

  return <Flex
    vertical={vertical}
    justify={justify}
    align={align}
    gap={gap}
    style={{
      padding: theme.custom.spacing.medium ,
      borderRadius: theme.custom.radius.medium,
      backgroundColor: theme.custom.colors.background.light,
      border: border ? `1px solid ${theme.custom.colors.neutral[200]}` : 'none',
      width: 'fit-content',
      height: 'fit-content',
      ...style,
    }}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </Flex>;
};