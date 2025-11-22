import React, { useEffect } from 'react';

import { Skeleton } from 'antd';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { useGetPortalDashboardAccessApi } from '@shared/hooks/access/useGetPortalDashboardAccess';
import type { PortalDashboardAccess } from '@shared/types/access/PortalDashboardAccess';

import type { Store } from '@shared/types/store';

import { StoreOverviewMobileView } from './StoreOverviewMobileView';
import { StoreOverviewDesktopView } from './StoreOverviewDesktopView';

interface Props {
  store: Store;
}

export const StoreOverview: React.FC<Props> = ({ store }) => {
  const isMobile = useIsMobile();

  const {
    getPortalDashboardAccess,
    data: portalDashboardAccessData,
    loading: portalDashboardAccessLoading,
  } = useGetPortalDashboardAccessApi();

  useEffect(() => {
    getPortalDashboardAccess();
  }, [getPortalDashboardAccess]);

  if (portalDashboardAccessLoading) {
    return <Skeleton active />;
  }

  return isMobile ? (
    <StoreOverviewMobileView
      store={store}
      portalDashboardAccess={portalDashboardAccessData as PortalDashboardAccess}
    />
  ) : (
    <StoreOverviewDesktopView
      store={store}
      portalDashboardAccess={portalDashboardAccessData as PortalDashboardAccess}
    />
  );
};
