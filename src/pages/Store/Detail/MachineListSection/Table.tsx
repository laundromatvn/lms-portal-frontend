import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, Select, Table, Typography, notification } from 'antd';

import {
  Refresh,
  Settings,
  Play,
} from '@solar-icons/react'

import { useTheme } from '@shared/theme/useTheme';

import {
  useListMachineApi,
  type ListMachineResponse,
} from '@shared/hooks/useListMachineApi';
import {
  useListControllerApi,
  type ListControllerResponse,
} from '@shared/hooks/useListControllerApi';
import {
  useActivateMachineApi,
  type ActivateMachineResponse,
} from '@shared/hooks/useActivateMachineApi';

import { formatCurrencyCompact } from '@shared/utils/currency';

import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import LeftRightSection from '@shared/components/LeftRightSection';
import { MachineSettingDrawer } from '@shared/components/Drawer/MachineSettingDrawer';
import { StartMachineDrawer } from '@shared/components/Drawer/StartMachineDrawer';


interface Props {
  store: Store;
}

export const MachineListTableView: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isMachineSettingDrawerOpen, setIsMachineSettingDrawerOpen] = useState(false);
  const [isStartMachineDrawerOpen, setIsStartMachineDrawerOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<any | null>(null);
  const [selectedMachineForConfig, setSelectedMachineForConfig] = useState<any | null>(null);
  const [selectedControllerId, setSelectedControllerId] = useState<string | null>(null);

  const columns = [
    { title: t('common.relayNo'), dataIndex: 'relay_no', width: 48 },
    { title: t('common.name'), dataIndex: 'name' },
    { title: t('common.machineType'), dataIndex: 'machine_type', width: 128 },
    { title: t('common.basePrice'), dataIndex: 'base_price', width: 128 },
    { title: t('common.status'), dataIndex: 'status',
      render: (status: string) => (
        <DynamicTag value={status} />
      ),
      width: 128
    },
    {
      title: t('common.actions'), dataIndex: 'actions', width: 256,
      render: (_: string, record: any) => (
        <Flex gap={theme.custom.spacing.medium}>
          <Button
            type="default"
            onClick={() => {
              setIsStartMachineDrawerOpen(true);
              setSelectedMachine(record);
            }}
            icon={<Play />}
          />
          <Button
            type="default"
            onClick={() => activateMachine(record.id)}
            loading={activateMachineLoading}
            icon={<Refresh />}
          />
          <Button type="default" onClick={() => {
            setIsMachineSettingDrawerOpen(true);
            setSelectedMachineForConfig(record);
          }}
            icon={<Settings />}
          />
        </Flex>
      )
    },
  ];

  const {
    data: listControllerData,
    loading: listControllerLoading,
    listController,
  } = useListControllerApi<ListControllerResponse>();
  const {
    data: listMachineData,
    loading: listMachineLoading,
    listMachine,
  } = useListMachineApi<ListMachineResponse>();
  const {
    activateMachine,
    data: activateMachineData,
    loading: activateMachineLoading,
    error: activateMachineError,
  } = useActivateMachineApi<ActivateMachineResponse>();

  const handleListMachine = () => {
    if (!selectedControllerId) return;

    listMachine({
      controller_id: selectedControllerId as string,
      page,
      page_size: pageSize
    });
  }

  useEffect(() => {
    handleListMachine();
  }, [selectedControllerId]);

  useEffect(() => {
    listController({
      store_id: store.id,
      page,
      page_size: pageSize,
    });
  }, [store]);

  useEffect(() => {
    if (listControllerData) {
      setSelectedControllerId(listControllerData.data[0].id);
    }
  }, [listControllerData]);

  useEffect(() => {
    if (activateMachineData) {
      api.success({
        message: t('messages.resetMachineSuccess'),
      });
      handleListMachine();
    }
  }, [activateMachineData]);

  useEffect(() => {
    if (activateMachineError) {
      api.error({
        message: t('messages.resetMachineError'),
      });
    }
  }, [activateMachineError]);

  return (
    <BaseDetailSection title={t('common.machines')} onRefresh={handleListMachine}>
      {contextHolder}

      <LeftRightSection
        left={(null)}
        right={(
          <>
            <Select
              options={listControllerData?.data.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              value={selectedControllerId}
              onChange={(value) => setSelectedControllerId(value)}
              style={{ width: 240 }}
              loading={listControllerLoading}
              placeholder={t('common.selectController')}
            />
          </>
        )}
        rightStyle={{ gap: theme.custom.spacing.small }}
      />

      <Table
        dataSource={listMachineData?.data}
        columns={columns}
        pagination={{
          pageSize,
          current: page,
          total: listMachineData?.total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
            listMachine({
              controller_id: selectedControllerId as string,
              page,
              page_size: pageSize
            });
          },
        }}
        loading={listMachineLoading}
        style={{ width: '100%' }}
      />

      {selectedMachineForConfig && (
        <MachineSettingDrawer
          key={`config-${selectedMachineForConfig.id}`}
          machine={selectedMachineForConfig}
          isDrawerOpen={isMachineSettingDrawerOpen}
          setIsDrawerOpen={setIsMachineSettingDrawerOpen}
          onSave={() => {
            setSelectedMachineForConfig(null);
            listMachine({
              controller_id: selectedControllerId as string,
              page,
              page_size: pageSize
            });
          }}
        />
      )}

      {selectedMachine && (
        <StartMachineDrawer
          key={`start-${selectedMachine.id}`}
          machine={selectedMachine}
          isDrawerOpen={isStartMachineDrawerOpen}
          setIsDrawerOpen={setIsStartMachineDrawerOpen}
          onStartSuccess={() => {
            setSelectedMachine(null);
            listMachine({
              controller_id: selectedControllerId as string,
              page,
              page_size: pageSize
            });
          }}
        />
      )}
    </BaseDetailSection>
  );
};
