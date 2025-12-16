import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Button } from 'antd';

import { FilterOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import { Chip } from './Chip';

interface ChipFilterProps {
  options: { label: string; value: any }[];
  values: { label: string; value: any }[];
  onChange: (value: { label: string; value: any }[]) => void;
  onFilterClick?: () => void;
  style?: React.CSSProperties;
}

export const ChipFilter: React.FC<ChipFilterProps> = ({ options, values = [] as { label: string; value: any }[], onChange, onFilterClick, style }) => {
  const { t } = useTranslation();
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
      justify="start"
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
        {options.map((option) => {
          const selected = values.some((v) => v.value === option.value);

          return (
            <Chip
              key={option.value}
              label={option.label}
              value={option.value}
              selected={selected}
              onChange={handleChange}
            />
          );
        })}
      </Flex>

      {onFilterClick && <Button
        icon={<FilterOutlined />}
        shape="round"
        onClick={onFilterClick}
        style={{
          backgroundColor: theme.custom.colors.background.surface,
          borderColor: theme.custom.colors.neutral[300],
          flexShrink: 0,
        }}
      >
        {t('overviewV2.moreFilters')}
      </Button>}
    </Flex>
  );
};