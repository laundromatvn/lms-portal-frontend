import React, { use, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Empty, Flex, Select, Skeleton, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';

import { useListStoreApi, type ListStoreResponse } from '@shared/hooks/useListStoreApi';
import { useListMachineApi, type ListMachineResponse } from '@shared/hooks/useListMachineApi';
import { useGetMachineStatusLineChartApi } from '@shared/hooks/dashboard/useGetMachineStatusLineChartApi';

import { Box } from '@shared/components/Box';

import { MachineStatusLineChart } from './LineChart';
import { LeftRightSection } from '@shared/components/LeftRightSection';

export interface Props {
  height?: number;
}

export const MachineStatusLineChartSection: React.FC<Props> = ({ height }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const tenant = tenantStorage.load();
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(undefined);
  const [selectedMachineId, setSelectedMachineId] = useState<string | undefined>(undefined);

  const {
    getMachineStatusLineChart,
    data: machineStatusLineChart,
    loading: machineStatusLineChartLoading,
  } = useGetMachineStatusLineChartApi();

  const {
    listStore,
    data: stores,
    loading: storesLoading,
    error: storesError,
  } = useListStoreApi<ListStoreResponse>();

  const {
    listMachine,
    data: machines,
    loading: machinesLoading,
    error: machinesError,
  } = useListMachineApi<ListMachineResponse>();

  useEffect(() => {
    if (selectedStoreId && selectedMachineId) {
      getMachineStatusLineChart({
        store_id: selectedStoreId as string,
        machine_id: selectedMachineId as string
      });
    }
  }, [selectedStoreId, selectedMachineId]);

  useEffect(() => {
    if (machines) {
      console.log(machines);
    }
  }, [selectedStoreId, selectedMachineId]);

  useEffect(() => {
    if (selectedStoreId) {
      listMachine({ store_id: selectedStoreId as string, page: 1, page_size: 100 });
    }
  }, [selectedStoreId]);

  useEffect(() => {
    listStore({ tenant_id: tenant?.id as string, page: 1, page_size: 100 });
  }, []);

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%', height }}>
      <Typography.Title level={3}>
        {t('overview.machineStatus.title')}
      </Typography.Title>

      <LeftRightSection
        left={null}
        right={(
          <Flex gap={theme.custom.spacing.medium}>
            <Select
              options={machines?.data.map((machine) => ({
                label: machine.name,
                value: machine.id,
              }))}
              value={selectedMachineId}
              onChange={(value) => {
                setSelectedMachineId(value);
              }}
              loading={storesLoading}
              placeholder={t('common.selectMachine')}
              style={{ width: 240 }}
            />

            <Select
              options={stores?.data.map((store) => ({
                label: store.name,
                value: store.id,
              }))}
              value={selectedStoreId}
              onChange={(value) => {
                setSelectedStoreId(value);
              }}
              loading={storesLoading}
              placeholder={t('common.selectStore')}
              style={{ width: 240 }}
            />
          </Flex>
        )}
      />

      {machineStatusLineChartLoading && <Skeleton active />}

      {machineStatusLineChart && machineStatusLineChart.length > 0 ? (
        <MachineStatusLineChart
          data={machineStatusLineChart}
        />
      ) : (
        <Flex vertical gap={theme.custom.spacing.medium} justify="center" align="center" style={{ width: '100%', height: '100%' }}>
          <Empty description={t('overview.machineStatus.noData')} />
          <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.medium }}>
            {t('overview.machineStatus.pleaseSelectMachineAndStoreToViewData')}
          </Typography.Text>
        </Flex>
      )}
    </Box>
  );
};
