import React, { use, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Empty, Flex, Select, Skeleton, Typography } from 'antd';

import { Refresh } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';

import { useListStoreApi, type ListStoreResponse } from '@shared/hooks/useListStoreApi';
import { useListControllerApi, type ListControllerResponse } from '@shared/hooks/useListControllerApi';
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
  const [selectedControllerId, setSelectedControllerId] = useState<string | undefined>(undefined);
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
    listController,
    data: controllers,
    loading: controllersLoading,
    error: controllersError,
  } = useListControllerApi<ListControllerResponse>();
  const {
    listMachine,
    data: machines,
    loading: machinesLoading,
    error: machinesError,
  } = useListMachineApi<ListMachineResponse>();

  const handleListOverviewOrder = async () => {
    if (!selectedMachineId) return;

    getMachineStatusLineChart({
      store_id: selectedStoreId as string,
      machine_id: selectedMachineId as string
    });
  };

  useEffect(() => {
    handleListOverviewOrder();
  }, [selectedMachineId]);

  useEffect(() => {
    if (selectedControllerId) {
      listMachine({ controller_id: selectedControllerId as string, page: 1, page_size: 100 });
    }
  }, [selectedControllerId]);

  useEffect(() => {
    if (selectedStoreId) {
      listController({ store_id: selectedStoreId as string, page: 1, page_size: 100 });
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
          <Flex align="center" gap={theme.custom.spacing.medium}>
            <Button
              icon={<Refresh />}
              onClick={handleListOverviewOrder}
            />

            <Select
              options={machines?.data.map((machine) => ({
                label: machine.name ? `Relay ${machine.relay_no} - ${machine.name}` : `Relay ${machine.relay_no}`,
                value: machine.id,
              }))}
              value={selectedMachineId}
              onChange={(value) => {
                setSelectedMachineId(value);
              }}
              loading={storesLoading}
              placeholder={t('common.selectMachine')}
              style={{ width: 180 }}
            />

            <Select
              options={controllers?.data.map((controller) => ({
                label: controller.name
                  ? <Flex vertical gap={theme.custom.spacing.small}>
                    <Typography.Text>{controller.name}</Typography.Text>
                    <Typography.Text type="secondary">{controller.device_id}</Typography.Text>
                  </Flex>
                  : <Flex gap={theme.custom.spacing.small}>
                    <Typography.Text type="secondary">{t('common.controller')}</Typography.Text>
                    <Typography.Text type="secondary">{controller.device_id}</Typography.Text>
                  </Flex>,
                value: controller.id,
                render: (_: any, record: any) => record.name ? `${record.name} (${record.device_id})` : record.device_id,
              }))}
              value={selectedControllerId}
              onChange={(value) => {
                setSelectedControllerId(value);
              }}
              labelRender={(label) => {
                const selectedController = controllers?.data.find(controller => controller.id === selectedControllerId);
                return selectedController?.name || selectedController?.device_id || label?.label;
              }}
              loading={controllersLoading}
              placeholder={t('common.selectController')}
              style={{ width: 180 }}
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
              style={{ width: 180 }}
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
