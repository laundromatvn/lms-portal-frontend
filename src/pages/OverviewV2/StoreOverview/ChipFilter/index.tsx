import React from 'react';

import { Flex, Button } from 'antd';

import { FilterOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import { Chip } from './Chip';

type ChipFilterOption = {
  label: string;
  value: any;
};

interface ChipFilterProps {
  options: ChipFilterOption[];
  values: ChipFilterOption[];
  onChange: (value: ChipFilterOption[]) => void;
  onFilterClick?: () => void;
  style?: React.CSSProperties;
}

export const ChipFilter: React.FC<ChipFilterProps> = ({
  options,
  values = [] as ChipFilterOption[],
  onChange,
  onFilterClick,
  style,
}) => {
  const theme = useTheme();

  const handleChange = (value: any) => {
    const selected = values.some((v) => v.value === value);

    const singleSelectionValues = ['today', 'yesterday', 'this_week', 'this_month', 'all'];

    if (singleSelectionValues.includes(value)) {
      if (selected) {
        onChange([]);
      } else {
        const selectedOption = options.find((o) => o.value === value);
        if (selectedOption) {
          onChange([{ label: selectedOption.label, value: selectedOption.value }]);
        }
      }
      return;
    }

    if (selected) {
      onChange(values.filter((v) => v.value !== value));
    } else {
      const selectedOption = options.find((o) => o.value === value);
      if (selectedOption) {
        onChange([...values, { label: selectedOption.label, value: selectedOption.value }]);
      }
    }
  };

  return (
    <Flex
      justify="flex-start"
      align="center"
      gap={theme.custom.spacing.small}
      style={{
        width: '100%',
        ...style,
      }}
    >
      <Flex
        justify="start"
        align="center"
        gap={theme.custom.spacing.small}
        style={{
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            value={option.value}
            selected={values.some((v) => v.value === option.value)}
            onChange={handleChange}
          />
        ))}
      </Flex>

      {onFilterClick && (
        <Button
          type="default"
          shape="round"
          size="large"
          onClick={onFilterClick}
          icon={<FilterOutlined />}
          style={{
            minWidth: 40,
            backgroundColor: theme.custom.colors.background.light,
          }}
        />
      )}
    </Flex>
  );
};
