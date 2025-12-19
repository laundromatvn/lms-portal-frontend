import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Table,
  Typography,
  notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import {
  Refresh,
  Settings,
  Play,
} from '@solar-icons/react'

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

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

import { StartMachineDrawer } from '@shared/components/Drawer/StartMachineDrawer';
import { MachineSettingDrawer } from '@shared/components/Drawer/MachineSettingDrawer';


interface Props {
  controller: Controller;
  onSuccess?: () => void;
}

export const TableView: React.FC<Props> = ({ controller }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState('relay_no');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  const [isMachineSettingDrawerOpen, setIsMachineSettingDrawerOpen] = useState(false);
  const [isStartMachineDrawerOpen, setIsStartMachineDrawerOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const columns: ColumnsType<Machine> = [
    {
      title: t('common.relayNo'),
      dataIndex: 'relay_no',
      key: 'relay_no',
      width: 48,
      sorter: true,
      sortOrder: orderBy === 'relay_no' ? (orderDirection === 'asc' ? 'ascend' as const : 'descend' as const) : undefined,
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      width: 256,
      sorter: true,
      sortOrder: orderBy === 'name' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: Machine) => (
        <Typography.Link onClick={() => navigate(`/machines/${record.id}/detail`)}>
          {`${t('common.machine')} ${record.name || record.relay_no}`}
        </Typography.Link>
      )
    },
    {
      title: t('common.machineType'),
      dataIndex: 'machine_type',
      key: 'machine_type',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'machine_type' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.basePrice'),
      dataIndex: 'base_price',
      key: 'base_price',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'base_price' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (text: string) => (
        <Typography.Text strong style={{ color: theme.custom.colors.success.default }}>
          {formatCurrencyCompact(text)}
        </Typography.Text>
      )
    },
    {
      title: t('common.coinValue'),
      dataIndex: 'coin_value',
      key: 'coin_value',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'coin_value' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (text: string) => (
        <Typography.Text strong style={{ color: theme.custom.colors.success.default }}>
          {formatCurrencyCompact(text)}
        </Typography.Text>
      )
    },
    { 
      title: t('common.pulseDuration'),
      dataIndex: 'pulse_duration',
      key: 'pulse_duration',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'pulse_duration' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    { 
      title: t('common.pulseInterval'),
      dataIndex: 'pulse_interval',
      key: 'pulse_interval',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'pulse_interval' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'status' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (status: string) => (
        <DynamicTag value={status} />
      ),
    },
    {
      title: t('common.actions'), dataIndex: 'actions', render: (_: string, record: Machine) => (
        <Flex gap={theme.custom.spacing.medium}>
          {can('machine.start') && (
            <Button
              onClick={() => {
                setIsStartMachineDrawerOpen(true);
                setSelectedMachine(record);
              }}
              icon={<Play />}
            />
          )}

          {can('machine.restart') && <Button
            onClick={() => activateMachine(record.id)}
            icon={<Refresh />}
            loading={activateMachineLoading}
          />}

          {can('machine.update') && <Button
            onClick={() => {
              setIsMachineSettingDrawerOpen(true);
              setSelectedMachine(record);
            }}
            icon={<Settings />}
          />}
        </Flex>
      )
    },
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
      page_size: pageSize,
      order_by: orderBy,
      order_direction: orderDirection || 'asc',
    });
  }

  useEffect(() => {
    handleListMachine();
  }, [orderBy, orderDirection, page, pageSize]);

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
    <BaseDetailSection
      title={t('common.machines')}
      onRefresh={handleListMachine}
    >
      {contextHolder}

      <Table
        dataSource={listMachineData?.data}
        columns={columns}
        loading={listMachineLoading}
        pagination={{
          pageSize,
          current: page,
          total: listMachineData?.total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        onChange={(pagination, _filters, sorter) => {
          if (sorter && !Array.isArray(sorter)) {
            const field = ('field' in sorter && sorter.field) || ('columnKey' in sorter && sorter.columnKey);
            if (field && sorter.order) {
              setOrderBy(field as string);
              setOrderDirection(sorter.order === 'ascend' ? 'asc' : 'desc');
            } else if (sorter.order === null || sorter.order === undefined) {
              setOrderBy('relay_no');
              setOrderDirection('asc');
            }
          }

          setPage(pagination.current || 1);
          setPageSize(pagination.pageSize || 10);
        }}
        style={{ width: '100%' }}
      />

      {isMachineSettingDrawerOpen && (
        <MachineSettingDrawer
          key={`machine-setting-${selectedMachine?.id}`}
          machine={selectedMachine as Machine}
          isDrawerOpen={isMachineSettingDrawerOpen}
          setIsDrawerOpen={setIsMachineSettingDrawerOpen}
          onSave={() => {
            setSelectedMachine(null);
            handleListMachine();
          }}
        />
      )}

      {isStartMachineDrawerOpen && (
        <StartMachineDrawer
          key={`start-machine-${selectedMachine?.id}`}
          machine={selectedMachine as Machine}
          isDrawerOpen={isStartMachineDrawerOpen}
          setIsDrawerOpen={setIsStartMachineDrawerOpen}
          onStartSuccess={() => {
            setSelectedMachine(null);
            handleListMachine();
          }}
        />
      )}
    </BaseDetailSection>
  );
};
