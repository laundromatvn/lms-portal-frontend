import React, { useMemo } from 'react';

import { Flex, Button } from 'antd';

import { FilterOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import { Chip } from './Chip';

export interface QuickFilterOption {
  label: string;
  value: string;
  filter: Record<string, any>;
}

export interface ChipFilterComponentProps {
  quickFilterOptions: QuickFilterOption[];
  onFilterChange: (filters: Record<string, any>) => void;
  onFilterClick?: () => void;
  values: Record<string, any>;
  style?: React.CSSProperties;
}

export const ChipFilter: React.FC<ChipFilterComponentProps> = ({
  quickFilterOptions,
  onFilterChange,
  onFilterClick,
  values = {},
  style,
}) => {
  const theme = useTheme();

  const selectedQuickFilterValue = useMemo(() => {
    const quickFilterKeys = new Set<string>();

    quickFilterOptions.forEach((option) => {
      if (option.value !== 'all') {
        Object.keys(option.filter).forEach((key) => quickFilterKeys.add(key));
      }
    });

    const hasQuickFilterValues = Array.from(quickFilterKeys).some((key) => {
      const value = values[key];
      return value !== null &&
        value !== undefined &&
        value !== '' &&
        (Array.isArray(value) ? value.length > 0 : true);
    });

    if (!hasQuickFilterValues) {
      return 'all';
    }

    for (const option of quickFilterOptions) {
      if (option.value === 'all') {
        continue;
      }

      const optionFilter = option.filter;
      let matches = true;
      let hasAnyFilterValue = false;

      for (const [key, optionValue] of Object.entries(optionFilter)) {
        if (optionValue === null || optionValue === undefined || optionValue === '') {
          continue;
        }

        hasAnyFilterValue = true;
        const currentValue = values[key];

        if (Array.isArray(optionValue)) {
          if (!Array.isArray(currentValue) ||
            optionValue.length !== currentValue.length ||
            !optionValue.every((v, i) => v === currentValue[i])) {
            matches = false;
            break;
          }
        } else if (optionValue !== currentValue) {
          matches = false;
          break;
        }
      }

      if (hasAnyFilterValue && matches) {
        return option.value;
      }
    }

    return undefined;
  }, [quickFilterOptions, values]);

  const handleQuickFilterChange = (value: string) => {
    const selectedOption = quickFilterOptions.find((opt) => opt.value === value);

    if (!selectedOption) {
      return;
    }

    if (value === 'all') {
      const quickFilterKeys = new Set<string>();
      quickFilterOptions.forEach((option) => {
        if (option.value !== 'all') {
          Object.keys(option.filter).forEach((key) => quickFilterKeys.add(key));
        }
      });

      const newFilters = { ...values };
      quickFilterKeys.forEach((key) => {
        if (Array.isArray(newFilters[key])) {
          newFilters[key] = [];
        } else {
          newFilters[key] = '';
        }
      });
      onFilterChange(newFilters);
      return;
    }

    if (selectedQuickFilterValue === value) {
      const newFilters = { ...values };
      Object.keys(selectedOption.filter).forEach((key) => {
        const currentValue = newFilters[key];
        const quickFilterValue = selectedOption.filter[key];

        if (Array.isArray(quickFilterValue) && Array.isArray(currentValue)) {
          if (quickFilterValue.length === currentValue.length &&
            quickFilterValue.every((v, i) => v === currentValue[i])) {
            newFilters[key] = [];
          }
        } else if (currentValue === quickFilterValue) {
          if (Array.isArray(currentValue)) {
            newFilters[key] = [];
          } else {
            newFilters[key] = '';
          }
        }
      });
      onFilterChange(newFilters);
      return;
    }

    const mergedFilters = { ...values };

    Object.entries(selectedOption.filter).forEach(([key, value]) => {
      mergedFilters[key] = value;
    });

    onFilterChange(mergedFilters);
  };

  return (
    <Flex
      align="center"
      gap={theme.custom.spacing.small}
      style={{
        width: '100%',
        ...style,
      }}
    >
      <Flex
        align="center"
        gap={theme.custom.spacing.small}
        style={{
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {quickFilterOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            value={option.value}
            selected={selectedQuickFilterValue === option.value}
            onChange={handleQuickFilterChange}
          />
        ))}
      </Flex>

      {onFilterClick && (
        <Button
          type="default"
          shape="circle"
          size="large"
          onClick={onFilterClick}
          icon={<FilterOutlined />}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            borderColor: theme.custom.colors.neutral[300],
            flexShrink: 0,
          }}
        />
      )}
    </Flex>
  );
};
