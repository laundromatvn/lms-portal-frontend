import React from 'react';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import type { Store } from '@shared/types/store';

import type { StoreOverviewFilter } from './types';

import { StoreKeyMetrics } from './StoreKeyMetrics';
import { TopOrderOverview } from './TopOrderOverview';
import { MachineOverview } from './MachineOverview';
import { ChipFilter } from './ChipFilter';

interface Props {
  store: Store;
  filterOptions: StoreOverviewFilter[];
  selectedFilters: StoreOverviewFilter[];
  onFilterChange: (filters: StoreOverviewFilter[]) => void;
  onFilterClick?: () => void;
  datetimeFilters?: {
    start_datetime: string;
    end_datetime: string;
  };
}

export const StoreOverviewDesktopView: React.FC<Props> = ({
  store,
  filterOptions,
  selectedFilters,
  onFilterChange,
  onFilterClick,
  datetimeFilters,
}) => {
  const theme = useTheme();
  const can = useCan();

  return (
    <Flex
      vertical
      gap={theme.custom.spacing.medium}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <ChipFilter
        options={filterOptions}
        values={selectedFilters}
        onChange={onFilterChange}
        onFilterClick={onFilterClick}
        style={{ justifyContent: 'flex-end' }}
      />

      {can('dashboard.overview.view') && (
        <StoreKeyMetrics
          store={store}
          filters={selectedFilters}
          datetimeFilters={datetimeFilters}
        />
      )}

      {can('order.list') && (
        <TopOrderOverview
          store={store}
          filters={selectedFilters}
          datetimeFilters={datetimeFilters}
        />
      )}

      {can('machine.list') && (
        <MachineOverview
          store={store}
          filters={selectedFilters}
          datetimeFilters={datetimeFilters}
        />
      )}
    </Flex>
  );
};
