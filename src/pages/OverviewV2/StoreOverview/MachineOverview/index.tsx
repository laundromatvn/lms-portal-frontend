import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {Flex} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';
import type { PortalDashboardAccess } from '@shared/types/access/PortalDashboardAccess';
import type { StoreOverviewFilter } from '../types';

import {
  useListMachineApi,
  type ListMachineResponse,
} from '@shared/hooks/useListMachineApi';

import { BaseSectionTitle } from '@shared/components/BaseSectionTitle';

import { MachineOverviewList } from './List';

interface Props {
  store: Store;
  portalDashboardAccess: PortalDashboardAccess;
  filters: StoreOverviewFilter[];
}

export const MachineOverview: React.FC<Props> = ({ store, portalDashboardAccess, filters }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    listMachine,
    data: listMachineData,
    loading: listMachineLoading,
  } = useListMachineApi<ListMachineResponse>();

  const handleListMachine = async () => {
    const queryParams = {
      store_id: store.id,
      page: 1,
      page_size: 100,
    } as Record<string, any>;

    if (filters.find((filter) => filter.value === 'today')) {
      queryParams.start_date = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
      queryParams.end_date = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
    } else if (filters.find((filter) => filter.value === 'this_week')) {
      queryParams.start_date = new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString();
      queryParams.end_date = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)).toISOString();
    } else if (filters.find((filter) => filter.value === 'this_month')) {
      queryParams.start_date = new Date(new Date().setDate(1)).toISOString();
      queryParams.end_date = new Date(new Date().setDate(new Date().getDate())).toISOString();
    } else if (filters.find((filter) => filter.value === 'this_year')) {
      queryParams.start_date = new Date(new Date().getFullYear(), 0, 1).toISOString();
      queryParams.end_date = new Date(new Date().getFullYear(), 11, 31).toISOString();
    }

    await listMachine(queryParams);
  };

  useEffect(() => {
    handleListMachine();
  }, [store, filters]);

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <BaseSectionTitle
        title={t('overviewV2.machineOverview')}
        onRefresh={handleListMachine}
      />

      <MachineOverviewList
        machines={listMachineData?.data || []}
        loading={listMachineLoading}
        onStartSuccess={handleListMachine}
        onSaveMachine={portalDashboardAccess?.portal_dashboard_machine_setting ? handleListMachine : undefined}
      />
    </Flex>
  );
};
