import React from 'react';

import { Button } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

interface ChipProps {
  label: string;
  value: string;
  selected: boolean;
  onChange: (value: string) => void;
}

export const Chip: React.FC<ChipProps> = ({ label, value, selected, onChange }) => {
  const theme = useTheme();

  return (
    <Button
      type={selected ? 'primary' : 'default'}
      shape="round"
      size="large"
      onClick={() => onChange(value)}
      style={{
        fontWeight: selected ? theme.custom.fontWeight.large : theme.custom.fontWeight.medium,
        backgroundColor: selected ? theme.custom.colors.info.light : theme.custom.colors.neutral[100],
        color: selected ? theme.custom.colors.info.default : theme.custom.colors.text.tertiary,
        borderColor: selected ? theme.custom.colors.info.light : theme.custom.colors.neutral[100],
        flexShrink: 0,
      }}
    >
      {label}
    </Button>
  );
};

