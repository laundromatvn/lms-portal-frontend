import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Segmented } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';

import type { PortalDashboardAccess } from '@shared/types/access/PortalDashboardAccess';

import { StoreKeyMetrics } from './StoreKeyMetrics';
import { TopOrderOverview } from './TopOrderOverview';
import { MachineOverview } from './MachineOverview';

interface Props {
  store: Store;
  portalDashboardAccess: PortalDashboardAccess;
}

export const StoreOverviewMobileView: React.FC<Props> = ({ store, portalDashboardAccess }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  const tabOptions = [
    { label: t('overviewV2.overview'), value: 'key_metrics', disabled: portalDashboardAccess?.portal_dashboard_overview },
    { label: t('overviewV2.order'), value: 'top_orders', disabled: portalDashboardAccess?.portal_dashboard_order_management },
    { label: t('overviewV2.machine'), value: 'machines', disabled: portalDashboardAccess?.portal_dashboard_machine_management },
  ];

  const [selectedTab, setSelectedTab] = useState<any>(tabOptions.find((option) => !option.disabled)?.value || tabOptions[0].value);

  return (
    <Flex
      vertical
      align="end"
      gap={theme.custom.spacing.medium}
      style={{ width: '100%', height: '100%' }}
    >
      <Segmented
        options={tabOptions.filter((option) => !option.disabled)}
        value={selectedTab}
        onChange={(value) => {
          setSelectedTab(value);
        }}
        style={{
          width: 'fit-content',
        }}
        size="large"
      />

      {selectedTab === 'key_metrics' && portalDashboardAccess?.portal_dashboard_overview && <StoreKeyMetrics store={store} />}
      {selectedTab === 'top_orders' && portalDashboardAccess?.portal_dashboard_order_management && <TopOrderOverview store={store} />}
      {selectedTab === 'machines' && portalDashboardAccess?.portal_dashboard_machine_management && (
        <MachineOverview store={store} portalDashboardAccess={portalDashboardAccess} />
      )}
    </Flex>
  );
};
