import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import type { Store } from '@shared/types/store';
import type { StoreOverviewFilter } from './types';

import { StoreOverviewMobileView } from './StoreOverviewMobileView';
import { StoreOverviewDesktopView } from './StoreOverviewDesktopView';

interface Props {
  store: Store;
  onFilterClick?: () => void;
  datetimeFilters?: {
    start_datetime: string;
    end_datetime: string;
  };
}

export const StoreOverview: React.FC<Props> = ({ store, onFilterClick, datetimeFilters }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const filterOptions = [
    { label: t('overviewV2.today'), value: 'today' },
    { label: t('overviewV2.yesterday'), value: 'yesterday' },
    { label: t('overviewV2.thisWeek'), value: 'this_week' },
    { label: t('overviewV2.thisMonth'), value: 'this_month' },
    { label: t('common.all'), value: 'all' },
  ];

  const [selectedFilters, setSelectedFilters] = useState<StoreOverviewFilter[]>([
    filterOptions[0],
  ]);

  const onFilterChange = (filters: StoreOverviewFilter[]) => {
    setSelectedFilters(filters);
    console.log(filters);
  };

  return isMobile ? (
    <StoreOverviewMobileView
      store={store}
      filterOptions={filterOptions}
      selectedFilters={selectedFilters}
      onFilterChange={onFilterChange}
      onFilterClick={onFilterClick}
      datetimeFilters={datetimeFilters}
    />
  ) : (
    <StoreOverviewDesktopView
      store={store}
      filterOptions={filterOptions}
      selectedFilters={selectedFilters}
      onFilterChange={onFilterChange}
      onFilterClick={onFilterClick}
      datetimeFilters={datetimeFilters}
    />
  );
};
