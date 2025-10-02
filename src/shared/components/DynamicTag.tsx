import React, { useMemo } from 'react';

import { Tag } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

interface Props {
  value: string;
  color?: string;
  style?: React.CSSProperties;
}

export const DynamicTag: React.FC<Props> = ({ value, color, style }) => {
  const theme = useTheme();

  const dynamicColor = useMemo(() => {
    switch (value.toLowerCase()) {
      case 'active':
      case 'idle':
        return theme.custom.colors.success.default;
      case 'inactive':
        return theme.custom.colors.neutral.default;
      case 'abandoned':
      case 'pending':
      case 'pending_setup':
      case 'busy':
        return theme.custom.colors.warning.default;
      case 'error':
        return theme.custom.colors.danger.default;
      case 'success':
        return theme.custom.colors.success.default;
      case 'new':
        return theme.custom.colors.info.default;
      default:
        return theme.custom.colors.neutral[400];
    }
  }, [value]);

  return <Tag
    color={color || dynamicColor}
    style={{
      borderRadius: theme.custom.radius.full,
      paddingLeft: theme.custom.spacing.medium,
      paddingRight: theme.custom.spacing.medium,
      height: 'fit-content',
      width: 'fit-content',
      ...style,
    }}
  >
    {value}
  </Tag>;
};
