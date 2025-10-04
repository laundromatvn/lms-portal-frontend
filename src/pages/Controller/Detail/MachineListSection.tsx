import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, Table, Typography, notification } from 'antd';

import {
  Settings,
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

import { type Controller } from '@shared/types/Controller';

import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';
import { BaseModal } from '@shared/components/BaseModal';
import LeftRightSection from '@shared/components/LeftRightSection';
import { MachineConfigModalContent } from './MachineConfigModalContent';

interface Props {
  controller: Controller;
}

export const MachineListSection: React.FC<Props> = ({ controller }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [api, contextHolder] = notification.useNotification();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);

  const columns = [
    { title: 'Relay No', dataIndex: 'relay_no' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Machine Type', dataIndex: 'machine_type' },
    { title: 'Base Price', dataIndex: 'base_price' },
    { title: 'Status', dataIndex: 'status', render: (status: string) => <DynamicTag value={status} /> },
    { title: 'Actions', dataIndex: 'actions' },
  ];

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
    listMachine({ controller_id: controller.id, page, page_size: pageSize });
  }, [controller]);

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

      listMachine({ controller_id: controller.id, page, page_size: pageSize });
    }
  }, [activateAllControllerMachinesData]);

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      {contextHolder}

      <Typography.Title level={3}>Machines</Typography.Title>

      <LeftRightSection
        left={null}
        right={(<>
          <Button
            type="primary"
            size="large"
            onClick={() => activateAllControllerMachines(controller.id)}
            loading={activateAllControllerMachinesLoading}
          >
            {t('common.activateAllControllerMachines')}
          </Button>
        </>)}
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
            listMachine({ controller_id: controller.id, page, page_size: pageSize });
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
              listMachine({ controller_id: controller.id, page, page_size: pageSize });
            }}
          />
        </BaseModal>
      )}
    </Box>
  );
};
