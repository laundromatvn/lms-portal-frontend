import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Segmented } from 'antd';

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

export const StoreOverviewMobileView: React.FC<Props> = ({
  store,
  filterOptions,
  selectedFilters,
  onFilterChange,
  portalDashboardAccess,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const tabOptions = [
    { label: t('overviewV2.overview'), value: 'key_metrics', enabled: portalDashboardAccess?.portal_dashboard_overview },
    { label: t('overviewV2.order'), value: 'top_orders', enabled: portalDashboardAccess?.portal_dashboard_order_management },
    { label: t('overviewV2.machine'), value: 'machines', enabled: portalDashboardAccess?.portal_dashboard_machine_management },
  ];

  const [selectedTab, setSelectedTab] = useState<any>(tabOptions.find((option) => option.enabled)?.value || tabOptions[0].value);

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
      <Segmented
        options={tabOptions.filter((option) => option.enabled)}
        value={selectedTab}
        onChange={(value) => {
          setSelectedTab(value);
        }}
        style={{
          width: 'fit-content',
          backgroundColor: theme.custom.colors.background.light,
        }}
        size="large"
      />

      <ChipFilter
        options={filterOptions}
        values={selectedFilters}
        onChange={onFilterChange}
      />

      {selectedTab === 'key_metrics' && portalDashboardAccess?.portal_dashboard_overview && (
        <StoreKeyMetrics store={store} filters={selectedFilters} />
      )}

      {selectedTab === 'top_orders' && portalDashboardAccess?.portal_dashboard_order_management && (
        <TopOrderOverview store={store} filters={selectedFilters} />
      )}

      {selectedTab === 'machines' && portalDashboardAccess?.portal_dashboard_machine_management && (
        <MachineOverview
          store={store}
          filters={selectedFilters}
          portalDashboardAccess={portalDashboardAccess}
        />
      )}
    </Flex>
  );
};
