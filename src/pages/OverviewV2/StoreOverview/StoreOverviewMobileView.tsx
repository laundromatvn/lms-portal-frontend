import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Segmented } from 'antd';

import { CartCheck, CashOut, WashingMachine } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

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

export const StoreOverviewMobileView: React.FC<Props> = ({
  store,
  filterOptions,
  selectedFilters,
  onFilterChange,
  onFilterClick,
  datetimeFilters,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState<string>('key_metrics');

  const tabOptions = [
    {
      label: t('overviewV2.overview'),
      value: 'key_metrics',
    },
    {
      label: t('overviewV2.order'),
      value: 'top_orders',
    },
    {
      label: t('overviewV2.machine'),
      value: 'machines',
    },
  ];

  return (
    <Flex
      vertical
      align="end"
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
      />

      <Segmented
        options={tabOptions}
        value={selectedTab}
        onChange={(value) => {
          setSelectedTab(value);
        }}
        style={{
          backgroundColor: theme.custom.colors.background.light,
          padding: theme.custom.spacing.xxsmall,
        }}
        size="large"
        shape="round"
      />

      {selectedTab === 'key_metrics' && (
        <StoreKeyMetrics store={store} filters={selectedFilters} datetimeFilters={datetimeFilters} />
      )}

      {selectedTab === 'top_orders' && (
        <TopOrderOverview store={store} filters={selectedFilters} datetimeFilters={datetimeFilters} />
      )}

      {selectedTab === 'machines' && (
        <MachineOverview
          store={store}
          filters={selectedFilters}
          datetimeFilters={datetimeFilters}
        />
      )}
    </Flex>
  );
};
