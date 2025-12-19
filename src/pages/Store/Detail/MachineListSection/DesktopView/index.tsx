import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Select,
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
  useListControllerApi,
  type ListControllerResponse,
} from '@shared/hooks/useListControllerApi';
import {
  useActivateMachineApi,
  type ActivateMachineResponse,
} from '@shared/hooks/useActivateMachineApi';

import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { MachineSettingDrawer } from '@shared/components/Drawer/MachineSettingDrawer';
import { StartMachineDrawer } from '@shared/components/Drawer/StartMachineDrawer';

import { formatCurrencyCompact } from '@shared/utils/currency';

import './style.css';

interface Props {
  store: Store;
}

export const DesktopView: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const can = useCan();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState('relay_no');
  const [orderDirection, setOrderDirection] = useState('asc');

  const [isMachineSettingDrawerOpen, setIsMachineSettingDrawerOpen] = useState(false);
  const [isStartMachineDrawerOpen, setIsStartMachineDrawerOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<any | null>(null);
  const [selectedMachineForConfig, setSelectedMachineForConfig] = useState<any | null>(null);
  const [selectedControllerId, setSelectedControllerId] = useState<string | undefined>(undefined);

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

  const columns: ColumnsType<any> = [
    {
      title: t('common.relayNo'),
      dataIndex: 'relay_no',
      width: 48,
      sorter: true,
      sortOrder: orderBy === 'relay_no' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
      width: 256,
      sorter: true,
      sortOrder: orderBy === 'name' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/machines/${record.id}/detail`)}>
          {`${t('common.machine')} ${record.name ? record.name : record.relay_no}`}
        </Typography.Link>
      ),
    },
    {
      title: t('common.machineType'),
      dataIndex: 'machine_type',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'machine_type' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (status: string) => (
        <DynamicTag value={status} type="text" />
      ),
    },
    {
      title: t('common.basePrice'),
      dataIndex: 'base_price',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'base_price' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (base_price: number) => (
        <Typography.Text>
          {formatCurrencyCompact(base_price)}
        </Typography.Text>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'status' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (status: string) => (
        <DynamicTag value={status} type="text" />
      ),
    },
    {
      title: t('common.actions'), dataIndex: 'actions', width: 256,
      render: (_: string, record: any) => (
        <Flex gap={theme.custom.spacing.xsmall}>
          {can('machine.restart') && (
            <Button
              icon={<Refresh />}
              onClick={() => {
                activateMachine(record.id);
                handleListMachine();
              }}
              loading={activateMachineLoading}
              style={{ backgroundColor: theme.custom.colors.background.light }}
            />
          )}

          {can('machine.update') && (
            <Button
              icon={<Settings />}
              onClick={() => {
                setIsMachineSettingDrawerOpen(true);
                setSelectedMachine(record);
              }}
              style={{ backgroundColor: theme.custom.colors.background.light }}
            />
          )}

          {can('machine.start') && (
            <Button
              icon={<Play />}
              onClick={() => {
                setIsStartMachineDrawerOpen(true);
                setSelectedMachine(record);
              }}
              style={{ backgroundColor: theme.custom.colors.background.light }}
            >
              {t('common.start')}
            </Button>
          )}
        </Flex>
      )
    },
  ];

  const handleListMachine = () => {
    if (!selectedControllerId) return;

    listMachine({
      controller_id: selectedControllerId as string,
      page,
      page_size: pageSize,
      order_by: orderBy,
      order_direction: orderDirection as 'asc' | 'desc',
    });
  }

  useEffect(() => {
    handleListMachine();
  }, [selectedControllerId, orderBy, orderDirection, page, pageSize]);

  useEffect(() => {
    listController({
      store_id: store.id,
      page_size: 100,
    });
  }, [store]);

  useEffect(() => {
    if (listControllerData && listControllerData.data.length > 0) {
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

      <Flex justify="end" align="center" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Select
          size="large"
          allowClear
          loading={listControllerLoading}
          placeholder={t('common.selectController')}
          value={selectedControllerId}
          onChange={(value) => setSelectedControllerId(value)}
          options={listControllerData?.data.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          style={{ width: '100%', maxWidth: 240 }}
        />
      </Flex>

      <Table
        bordered
        dataSource={listMachineData?.data || []}
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
              setOrderBy('');
              setOrderDirection('asc');
            }
          }

          setPage(pagination.current || 1);
          setPageSize(pagination.pageSize || 10);
        }}
        onRow={() => {
          return {
            style: {
              backgroundColor: theme.custom.colors.background.light,
            },
          };
        }}
        style={{
          width: '100%',
          backgroundColor: theme.custom.colors.background.light,
          color: theme.custom.colors.neutral.default,
        }}
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
