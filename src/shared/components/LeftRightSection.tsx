import React from 'react';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

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

  const isMobile = useIsMobile();

  const resolvedGap = gap ?? theme.custom.spacing.large;

  return (
    <Flex
      vertical={isMobile}
      align={isMobile ? 'flex-start' : align}
      justify={isMobile ? 'flex-start' : justify}
      gap={resolvedGap}
      style={{ width: '100%', ...style }}
    >
      <Flex
        vertical={isMobile}
        wrap={isMobile}
        justify={isMobile ? 'flex-start' : 'flex-start'}
        align={isMobile ? 'flex-start' : 'center'}
        style={{
          flex: 1,
          ...leftStyle,
          width: isMobile ? '100%' : 'auto',
        }}
      >
        {left}
      </Flex>
      <Flex
        vertical={isMobile}
        wrap={isMobile}
        justify={isMobile ? 'flex-end' : 'flex-end'}
        align={isMobile ? 'flex-end' : 'center'}
        style={{
          flex: 1,
          ...rightStyle,
          width: isMobile ? '100%' : 'auto',
        }}
      >
        {right}
      </Flex>
    </Flex>
  );
};

export default LeftRightSection;


