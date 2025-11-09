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
import { BaseModal } from '@shared/components/BaseModal';
import LeftRightSection from '@shared/components/LeftRightSection';
import { MachineConfigModalContent } from './MachineConfigModalContent';
import { StartMachineModalContent } from './StartMachineModalContent';


interface Props {
  store: Store;
}

export const MachineListTableView: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [api, contextHolder] = notification.useNotification();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStartMachineModalOpen, setIsStartMachineModalOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<any | null>(null);
  const [selectedControllerId, setSelectedControllerId] = useState<string | null>(null);

  const columns = [
    { title: t('common.relayNo'), dataIndex: 'relay_no', width: 48 },
    { title: t('common.name'), dataIndex: 'name' },
    { title: t('common.machineType'), dataIndex: 'machine_type', width: 128 },
    { title: t('common.basePrice'), dataIndex: 'base_price', width: 128 },
    { title: t('common.status'), dataIndex: 'status', render: (status: string) => <DynamicTag value={status} />, width: 128 },
    { title: t('common.actions'), dataIndex: 'actions', width: 256 },
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
                setSelectedMachineId(item.id);
                setSelectedMachine(item);
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
          key={`config-${selectedMachineId}`}
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
            key={`config-content-${selectedMachineId}`}
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

      {selectedMachine && (
        <BaseModal
          key={`start-${selectedMachine.id}`}
          closable={true}
          onCancel={() => {
            setIsStartMachineModalOpen(false);
            setSelectedMachineId(null);
            setSelectedMachine(null);
          }}
          maskClosable={true}
          isModalOpen={isStartMachineModalOpen}
          setIsModalOpen={setIsStartMachineModalOpen}
        >
          <StartMachineModalContent
            key={`start-content-${selectedMachine.id}`}
            machine={selectedMachine}
            onClose={() => {
              setIsStartMachineModalOpen(false);
              setSelectedMachineId(null);
              setSelectedMachine(null);
            }}
            onSuccess={() => {
              setIsStartMachineModalOpen(false);
              setSelectedMachineId(null);
              setSelectedMachine(null);
              listMachine({
                controller_id: selectedControllerId as string,
                page,
                page_size: pageSize
              });
            }}
          />
        </BaseModal>
      )}
    </BaseDetailSection>
  );
};
