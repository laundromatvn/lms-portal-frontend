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
  useActivateMachineApi,
  type ActivateMachineResponse,
} from '@shared/hooks/useActivateMachineApi';

import { formatCurrencyCompact } from '@shared/utils/currency';

import { type Controller } from '@shared/types/Controller';
import type { Machine } from '@shared/types/machine';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { BaseModal } from '@shared/components/BaseModal';
import LeftRightSection from '@shared/components/LeftRightSection';
import { MachineConfigModalContent } from './MachineConfigModalContent';
import { StartMachineModalContent } from './StartMachineModalContent';


interface Props {
  controller: Controller;
  onSuccess?: () => void;
}

export const MachineListSectionV2: React.FC<Props> = ({ controller }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [api, contextHolder] = notification.useNotification();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStartMachineModalOpen, setIsStartMachineModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const columns = [
    { title: t('common.relayNo'), dataIndex: 'relay_no', width: 48 },
    { title: t('common.name'), dataIndex: 'name' },
    { title: t('common.machineType'), dataIndex: 'machine_type', width: 128 },
    { title: t('common.basePrice'), dataIndex: 'base_price', width: 128 },
    { title: t('common.status'), dataIndex: 'status', render: (status: string) => <DynamicTag value={status} />, width: 128 },
    { title: t('common.actions'), dataIndex: 'actions', width: 256 },
  ];

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
    if (!controller.id) return;

    listMachine({
      controller_id: controller.id,
      page,
      page_size: pageSize
    });
  }

  useEffect(() => {
    if (listMachineData) {
      setDataSource(listMachineData.data.map((item) => ({
        relay_no: item.relay_no,
        name: item.name,
        machine_type: item.machine_type,
        base_price: formatCurrencyCompact(item.base_price),
        status: item.status,
        actions: (
          <Flex gap={theme.custom.spacing.medium}>
            <Button
              type="link"
              onClick={() => {
                setIsStartMachineModalOpen(true);
                setIsModalOpen(false);
                setSelectedMachine(item as Machine);
              }}
            >
              <Play weight="Bold" color={theme.custom.colors.success.default} />
            </Button>
            <Button
              type="link"
              onClick={() => activateMachine(item.id)}
              loading={activateMachineLoading}
            >
              <Refresh weight="Bold" color={theme.custom.colors.success.default} />
            </Button>
            <Button type="link" onClick={() => {
              setIsStartMachineModalOpen(false);
              setIsModalOpen(true);
              setSelectedMachine(item as Machine);
            }}>
              <Settings />
            </Button>
          </Flex>
        ),
      })));
    }
  }, [listMachineData]);

  useEffect(() => {
    handleListMachine();
  }, [controller]);

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
    <BaseDetailSection title={t('common.machines')} >
      {contextHolder}

      <LeftRightSection
        left={(null)}
        right={(
          <>
            <Button
              onClick={() => handleListMachine()}
              icon={<Refresh />}
            />
          </>
        )}
        rightStyle={{ gap: theme.custom.spacing.small }}
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
              controller_id: controller.id,
              page,
              page_size: pageSize
            });
          },
        }}
        loading={listMachineLoading}
        style={{ width: '100%' }}
      />

      {selectedMachine && isModalOpen && (
        <BaseModal
          key={`config-${selectedMachine.id}`}
          closable={true}
          onCancel={() => {
            setSelectedMachine(null);
          }}
          maskClosable={true}
          isModalOpen={isModalOpen}
          setIsModalOpen={(value) => {
            setIsModalOpen(value);
            setSelectedMachine(null);
          }}
        >
          <MachineConfigModalContent
            key={`config-content-${selectedMachine?.id}`}
            machine={selectedMachine as Machine}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedMachine(null);
            }}
            onSave={() => {
              listMachine({
                controller_id: controller.id,
                page,
                page_size: pageSize
              });
            }}
          />
        </BaseModal>
      )}

      {selectedMachine && isStartMachineModalOpen && (
        <BaseModal
          key={`start-${selectedMachine?.id}`}
          closable={true}
          onCancel={() => {
            setIsStartMachineModalOpen(false);
            setSelectedMachine(null);
          }}
          maskClosable={true}
          isModalOpen={isStartMachineModalOpen}
          setIsModalOpen={(value) => {
            setIsStartMachineModalOpen(value);
            setSelectedMachine(null);
          }}
        >
          <StartMachineModalContent
            key={`start-content-${selectedMachine?.id}`}
            machine={selectedMachine as Machine}
            onClose={() => {
              setIsStartMachineModalOpen(false);
              setSelectedMachine(null);
            }}
            onSuccess={() => {
              setIsStartMachineModalOpen(false);
              setSelectedMachine(null);
              handleListMachine();
            }}
          />
        </BaseModal>
      )}
    </BaseDetailSection>
  );
};
