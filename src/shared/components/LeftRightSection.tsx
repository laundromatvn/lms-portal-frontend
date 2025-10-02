import React from 'react';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

interface Props {
  left?: React.ReactNode;
  right?: React.ReactNode;
  gap?: number;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  style?: React.CSSProperties;
  leftStyle?: React.CSSProperties;
  rightStyle?: React.CSSProperties;
}

export const LeftRightSection: React.FC<Props> = ({
  left,
  right,
  gap,
  align = 'flex-start',
  justify = 'space-between',
  style,
  leftStyle,
  rightStyle,
}) => {
  const theme = useTheme();

  const resolvedGap = gap ?? theme.custom.spacing.large;

  return (
    <Flex
      align={align}
      justify={justify}
      gap={resolvedGap}
      style={{ width: '100%', ...style }}
    >
      <Flex justify="flex-start" align="center" style={{ flex: 1, ...leftStyle }}>{left}</Flex>
      <Flex justify="flex-end" align="center" style={{ flex: 1, ...rightStyle }}>{right}</Flex>
    </Flex>
  );
};

export default LeftRightSection;


