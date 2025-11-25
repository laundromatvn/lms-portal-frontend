import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Skeleton } from 'antd';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { useGetPortalDashboardAccessApi } from '@shared/hooks/access/useGetPortalDashboardAccess';
import type { PortalDashboardAccess } from '@shared/types/access/PortalDashboardAccess';

import type { Store } from '@shared/types/store';
import type { StoreOverviewFilter } from './types';

import { StoreOverviewMobileView } from './StoreOverviewMobileView';
import { StoreOverviewDesktopView } from './StoreOverviewDesktopView';

interface Props {
  store: Store;
}

export const StoreOverview: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const filterOptions = [
    { label: t('overviewV2.today'), value: 'today' },
    { label: t('overviewV2.thisWeek'), value: 'this_week' },
    { label: t('overviewV2.thisMonth'), value: 'this_month' },
    { label: t('overviewV2.thisYear'), value: 'this_year' },
  ];

  const [selectedFilters, setSelectedFilters] = useState<StoreOverviewFilter[]>([filterOptions[0]]);

  const {
    getPortalDashboardAccess,
    data: portalDashboardAccessData,
    loading: portalDashboardAccessLoading,
  } = useGetPortalDashboardAccessApi();

  const onFilterChange = (filters: StoreOverviewFilter[]) => {
    setSelectedFilters(filters);
    console.log(filters);
  };

  useEffect(() => {
    getPortalDashboardAccess();
  }, [getPortalDashboardAccess]);

  if (portalDashboardAccessLoading) {
    return <Skeleton active />;
  }

  return isMobile ? (
    <StoreOverviewMobileView
      store={store}
      filterOptions={filterOptions}
      selectedFilters={selectedFilters}
      onFilterChange={onFilterChange}
      portalDashboardAccess={portalDashboardAccessData as PortalDashboardAccess}
    />
  ) : (
    <StoreOverviewDesktopView
      store={store}
      filterOptions={filterOptions}
      selectedFilters={selectedFilters}
      onFilterChange={onFilterChange}
      portalDashboardAccess={portalDashboardAccessData as PortalDashboardAccess}
    />
  );
};
