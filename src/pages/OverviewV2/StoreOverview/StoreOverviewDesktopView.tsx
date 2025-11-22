import React from 'react';

import { Flex } from 'antd';

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

export const StoreOverviewDesktopView: React.FC<Props> = ({ store, portalDashboardAccess }) => {
  const theme = useTheme();

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%', height: '100%' }}>
      {portalDashboardAccess?.portal_dashboard_overview && <StoreKeyMetrics store={store} />}
      {portalDashboardAccess?.portal_dashboard_order_management && <TopOrderOverview store={store} />}
      {portalDashboardAccess?.portal_dashboard_machine_management && (
        <MachineOverview store={store} portalDashboardAccess={portalDashboardAccess} />
      )}
    </Flex>
  );
};
