import React, { useMemo } from 'react';

import { Tag } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { toCamelCase } from '@shared/utils/string';

interface Props {
  value: string;
  color?: string;
  style?: React.CSSProperties;
}

export const DynamicTag: React.FC<Props> = ({ value, color, style }) => {
  const theme = useTheme();

  const dynamicColor = useMemo(() => {
    switch (value.toLowerCase()) {
      case 'inactive':
        case 'new':
        return theme.custom.colors.neutral.default;
      case 'abandoned':
      case 'pending':
      case 'pending_setup':
      case 'busy':
      case 'in_progress':
      case 'dryer':
      case 'waiting_for_payment_detail':
      case 'waiting_for_purchase':
      case 'paused':
      case 'out_of_date':
        return theme.custom.colors.warning.default;
      case 'error':
      case 'failed':
      case 'payment_failed':
      case 'cancelled':
      case 'out_of_service':
      case 'deprecated':
        return theme.custom.colors.danger.default;
      case 'success':
      case 'payment_success':
      case 'active':
      case 'idle':
      case 'tenant_admin':
      case 'released':
      case 'patch':
        return theme.custom.colors.success.default;
      case 'waiting_for_payment':
      case 'washer':
      case 'tenant_staff':
      case 'scheduled':
      case 'minor':
        return theme.custom.colors.info.default;
      case 'admin':
      case 'finished':
      case 'major':
      case 'completed':
        return theme.custom.colors.accent_1.default;
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
    {toCamelCase(value)}
  </Tag>;
};
