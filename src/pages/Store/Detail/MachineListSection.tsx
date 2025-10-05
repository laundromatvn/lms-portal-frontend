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
  useActivateAllControllerMachinesApi,
  type ActivateAllControllerMachinesResponse,
} from '@shared/hooks/useActivateAllControllerMachinesApi';
import {
  useStartMachineApi,
  type StartMachineResponse,
} from '@shared/hooks/useStartMachineApi';

import {
  useListControllerApi,
  type ListControllerResponse,
} from '@shared/hooks/useListControllerApi';

import { type Store } from '@shared/types/store';

import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';
import { BaseModal } from '@shared/components/BaseModal';
import LeftRightSection from '@shared/components/LeftRightSection';
import { MachineConfigModalContent } from './MachineConfigModalContent';

interface Props {
  store: Store;
}

export const MachineListSection: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [api, contextHolder] = notification.useNotification();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [selectedControllerId, setSelectedControllerId] = useState<string | null>(null);

  const columns = [
    { title: 'Relay No', dataIndex: 'relay_no' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Machine Type', dataIndex: 'machine_type' },
    { title: 'Base Price', dataIndex: 'base_price' },
    { title: 'Status', dataIndex: 'status', render: (status: string) => <DynamicTag value={status} /> },
    { title: 'Actions', dataIndex: 'actions' },
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
    activateAllControllerMachines,
    data: activateAllControllerMachinesData,
    loading: activateAllControllerMachinesLoading,
    error: activateAllControllerMachinesError,
  } = useActivateAllControllerMachinesApi<ActivateAllControllerMachinesResponse>();
  const {
    startMachine,
    data: startMachineData,
    loading: startMachineLoading,
    error: startMachineError,
  } = useStartMachineApi<StartMachineResponse>();

  useEffect(() => {
    if (listMachineData) {
      setDataSource(listMachineData.data.map((item) => ({
        relay_no: item.relay_no,
        name: item.name,
        machine_type: item.machine_type,
        base_price: item.base_price,
        status: item.status,
        actions: (
          <Flex gap={theme.custom.spacing.medium}>
            <Button type="link" onClick={() => {
              startMachine(item.id);
            }}>
              <Play weight="Bold" color={theme.custom.colors.success.default} />
            </Button>
            <Button type="link" onClick={() => {
              setIsModalOpen(true);
              setSelectedMachineId(item.id);
            }}>
              <Settings />
            </Button>
          </Flex>
        ),
      })));
    }
  }, [listMachineData]);

  useEffect(() => {
    if (selectedControllerId) {
      listMachine({ controller_id: selectedControllerId as string, page, page_size: pageSize });
    }
  }, [selectedControllerId]);

  useEffect(() => {
    if (activateAllControllerMachinesError) {
      api.error({
        message: t('messages.activateAllControllerMachinesError'),
      });
    }
  }, [activateAllControllerMachinesError]);

  useEffect(() => {
    if (activateAllControllerMachinesData) {
      api.success({
        message: t('messages.activateAllControllerMachinesSuccess'),
      });

      listMachine({ controller_id: selectedControllerId as string, page, page_size: pageSize });
    }
  }, [activateAllControllerMachinesData]);

  useEffect(() => {
    listController({
      store_id: store.id,
      page,
      page_size: pageSize,
    });
  }, [store]);

  useEffect(() => {
    if (startMachineError) {
      api.error({
        message: t('messages.startMachineError'),
      });
    }
  }, [startMachineError]);

  useEffect(() => {
    if (startMachineData) {
      api.success({
        message: t('messages.startMachineSuccess'),
      });

      listMachine({
        controller_id: selectedControllerId as string,
        page,
        page_size: pageSize
      });
    }
  }, [startMachineData]);

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      {contextHolder}

      <Typography.Title level={3}>Machines</Typography.Title>

      <LeftRightSection
        left={(<Flex gap={theme.custom.spacing.medium}>
          <Select
            options={listControllerData?.data.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            onChange={(value) => setSelectedControllerId(value)}
            style={{ width: 240 }}
            loading={listControllerLoading}
            placeholder={t('common.selectController')}
          />
        </Flex>)}
        right={(<Flex gap={theme.custom.spacing.medium}>
          <Button
            type="text"
            size="large"
            onClick={() => listMachine({
              controller_id: selectedControllerId as string,
              page,
              page_size: pageSize
            })}
          >
            <Refresh size={24} />
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => activateAllControllerMachines(selectedControllerId as string)}
            loading={activateAllControllerMachinesLoading}
          >
            {t('common.activateAllControllerMachines')}
          </Button>
        </Flex>)}
      />

      <Table
        dataSource={dataSource}
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

      {selectedMachineId && (
        <BaseModal
          closable={true}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedMachineId(null);
          }}
          maskClosable={true}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        >
          <MachineConfigModalContent
            machineId={selectedMachineId}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedMachineId(null);
            }}
            onSave={() => {
              setSelectedMachineId(null);
              listMachine({
                controller_id: selectedControllerId as string,
                page,
                page_size: pageSize
              });
            }}
          />
        </BaseModal>
      )}
    </Box>
  );
};
