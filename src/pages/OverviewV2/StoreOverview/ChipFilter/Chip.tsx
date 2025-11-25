import React from 'react';

import { Button } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

interface Props {
  label: string;
  value: any;
  selected: boolean;
  onChange: (value: any) => void;
}

export const Chip: React.FC<Props> = ({ label, value, selected, onChange }) => {
  const theme = useTheme();

  return (
    <Button
      key={value}
      type={selected ? 'primary' : 'default'}
      shape="round"
      size="large"
      onClick={() => onChange(value)}
      style={{
        fontWeight: selected ? theme.custom.fontWeight.large : theme.custom.fontWeight.medium,
        backgroundColor: selected ? theme.custom.colors.info.light : theme.custom.colors.background.light,
        color: selected ? theme.custom.colors.info.default : theme.custom.colors.text.primary,
        borderColor: selected ? theme.custom.colors.info.light : theme.custom.colors.neutral[300],
        padding: '4px 16px',
        flexShrink: 0,
      }}
    >
      {label}
    </Button>
  );
};
