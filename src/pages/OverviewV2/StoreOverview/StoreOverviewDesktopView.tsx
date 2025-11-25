import React from 'react';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';

import type { PortalDashboardAccess } from '@shared/types/access/PortalDashboardAccess';
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
  portalDashboardAccess: PortalDashboardAccess;
}

export const StoreOverviewDesktopView: React.FC<Props> = ({
  store,
  filterOptions,
  selectedFilters,
  onFilterChange,
  portalDashboardAccess,
}) => {
  const theme = useTheme();

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
        style={{ justifyContent: 'flex-end' }}
      />

      {portalDashboardAccess?.portal_dashboard_overview && <StoreKeyMetrics store={store} filters={selectedFilters} />}
      {portalDashboardAccess?.portal_dashboard_order_management && <TopOrderOverview store={store} filters={selectedFilters} />}
      {portalDashboardAccess?.portal_dashboard_machine_management && (
        <MachineOverview store={store} filters={selectedFilters} portalDashboardAccess={portalDashboardAccess} />
      )}
    </Flex>
  );
};
