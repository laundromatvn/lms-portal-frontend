import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography, Table, Skeleton, notification, Select, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { CheckCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListStoreApi,
  type ListStoreResponse,
} from '@shared/hooks/useListStoreApi';
import {
  useListControllerApi,
  type ListControllerResponse,
} from '@shared/hooks/useListControllerApi';
import {
  useListMachineApi,
  type ListMachineResponse,
} from '@shared/hooks/useListMachineApi';
import {
  useActivateMachineApi,
  type ActivateMachineResponse,
} from '@shared/hooks/useActivateMachineApi';

import { MachineStatusEnum } from '@shared/enums/MachineStatusEnum';
import { MachineTypeEnum } from '@shared/enums/MachineTypeEnum';

import { formatCurrencyCompact } from '@shared/utils/currency';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Box } from '@shared/components/Box';

export const MachineListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [tableData, setTableData] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(undefined);
  const [selectedControllerId, setSelectedControllerId] = useState<string | undefined>(undefined);
  const [selectedMachineType, setSelectedMachineType] = useState<MachineTypeEnum | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<MachineStatusEnum | undefined>(undefined);
  const [orderBy, setOrderBy] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  const columns: ColumnsType<any> = [
    { title: t('common.storeName'), dataIndex: 'store_name', width: 256 },
    { title: t('common.deviceId'), dataIndex: 'controller_device_id', width: 128 },
    {
      title: t('common.relayNo'),
      dataIndex: 'relay_no',
      width: 48,
      sorter: (a: any, b: any) => {
        const aValue = a._relay_no || 0;
        const bValue = b._relay_no || 0;
        return aValue - bValue;
      },
      sortOrder: orderBy === 'relay_no' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.machineName'),
      dataIndex: 'name',
      width: 256,
      sorter: (a: any, b: any) => {
        const aValue = a._name || '';
        const bValue = b._name || '';
        return aValue.localeCompare(bValue);
      },
      sortOrder: orderBy === 'name' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.machineType'),
      dataIndex: 'machine_type',
      width: 128,
      sorter: (a: any, b: any) => {
        const aValue = a._machine_type || '';
        const bValue = b._machine_type || '';
        return aValue.localeCompare(bValue);
      },
      sortOrder: orderBy === 'machine_type' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.basePrice'),
      dataIndex: 'base_price',
      width: 128,
      sorter: (a: any, b: any) => {
        const aValue = a._base_price || 0;
        const bValue = b._base_price || 0;
        return aValue - bValue;
      },
      sortOrder: orderBy === 'base_price' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 128,
      sorter: (a: any, b: any) => {
        const aValue = a._status || '';
        const bValue = b._status || '';
        return aValue.localeCompare(bValue);
      },
      sortOrder: orderBy === 'status' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    { title: t('common.actions'), dataIndex: 'actions' },
  ];

  const {
    data: listMachineData,
    loading: listMachineLoading,
    error: listMachineError,
    listMachine,
  } = useListMachineApi<ListMachineResponse>();
  const {
    activateMachine,
    data: activateMachineData,
    loading: activateMachineLoading,
    error: activateMachineError,
  } = useActivateMachineApi<ActivateMachineResponse>();
  const {
    data: listStoreData,
    listStore,
  } = useListStoreApi<ListStoreResponse>();
  const {
    data: listControllerData,
    listController,
  } = useListControllerApi<ListControllerResponse>();

  const handleListMachine = () => {
    listMachine({
      page,
      page_size: pageSize,
      store_id: selectedStoreId,
      controller_id: selectedControllerId,
      machine_type: selectedMachineType,
      status: selectedStatus,
      order_by: orderBy,
      order_direction: orderDirection,
    });
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter && sorter.field) {
      setOrderBy(sorter.field);
      setOrderDirection(sorter.order === 'ascend' ? 'asc' : 'desc');
    }
  };

  useEffect(() => {
    if (listMachineData) {
      setTableData(listMachineData?.data.map((item) => ({
        id: item.id,
        store_name: <Typography.Link onClick={() => navigate(`/stores/${item.store_id}/detail`)}>{item.store_name || '-'}</Typography.Link>,
        controller_id: <Typography.Link onClick={() => navigate(`/controllers/${item.controller_id}/detail`)}>{item.controller_id || '-'}</Typography.Link>,
        controller_device_id: <Typography.Link onClick={() => navigate(`/controllers/${item.controller_id}/detail`)}>{item.controller_device_id || '-'}</Typography.Link>,
        relay_no: item.relay_no,
        name: <Typography.Link onClick={() => navigate(`/machines/${item.id}/detail`)}>{item.name || '-'}</Typography.Link>,
        machine_type: item.machine_type,
        base_price: formatCurrencyCompact(item.base_price),
        status: <DynamicTag value={item.status} />,
        actions: (
          <Flex gap={theme.custom.spacing.medium}>
            <Button
              type="link"
              onClick={() => {
                activateMachine(item.id);
              }}
              loading={activateMachineLoading}
              icon={<CheckCircle weight="Outline" />}
              style={{
                color: theme.custom.colors.success.default,
              }}
            >
              {t('common.activateMachine')}
            </Button>
          </Flex>
        ),
        // Raw values for sorting
        _relay_no: item.relay_no,
        _name: item.name,
        _machine_type: item.machine_type,
        _base_price: item.base_price,
        _status: item.status,
      })));
    }
  }, [listMachineData]);

  useEffect(() => {
    if (listMachineError) {
      api.error({
        message: t('machine.listMachineError'),
      });
    }
  }, [listMachineError]);

  useEffect(() => {
    handleListMachine();
  }, [page, pageSize, selectedStoreId, selectedControllerId, selectedMachineType, selectedStatus, orderBy, orderDirection]);

  useEffect(() => {
    if (activateMachineError) {
      api.error({
        message: t('messages.activateMachineError'),
      });
    }
  }, [activateMachineError]);

  useEffect(() => {
    if (activateMachineData) {
      api.success({
        message: t('messages.activateMachineSuccess'),
      });

      listMachine({ page, page_size: pageSize });
    }
  }, [activateMachineData]);

  useEffect(() => {
    if (selectedStoreId) {
      listController({ store_id: selectedStoreId, page, page_size: 100 });
    }
  }, [selectedStoreId]);

  useEffect(() => {
    listStore({ page: 1, page_size: 100 });
  }, []);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('common.machineList')}</Typography.Title>

        <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
          <LeftRightSection
            left={null}
            right={(
              <Flex gap={theme.custom.spacing.medium}>
                <Select
                  options={[
                    { label: t('common.pendingSetup'), value: MachineStatusEnum.PENDING_SETUP as string },
                    { label: t('common.idle'), value: MachineStatusEnum.IDLE as string },
                    { label: t('common.starting'), value: MachineStatusEnum.STARTING as string },
                    { label: t('common.busy'), value: MachineStatusEnum.BUSY as string },
                    { label: t('common.outOfService'), value: MachineStatusEnum.OUT_OF_SERVICE as string },
                  ]}
                  value={selectedStatus as string}
                  onChange={(value) => setSelectedStatus(value as MachineStatusEnum)}
                  style={{ width: 156 }}
                  allowClear
                  placeholder={t('common.selectStatus')}
                />

                <Select
                  options={[
                    { label: t('common.washer'), value: MachineTypeEnum.WASHER as string },
                    { label: t('common.dryer'), value: MachineTypeEnum.DRYER as string },
                  ]}
                  value={selectedMachineType as string}
                  onChange={(value) => setSelectedMachineType(value as MachineTypeEnum)}
                  style={{ width: 156 }}
                  allowClear
                  placeholder={t('common.selectMachineType')}
                />

                <Select
                  options={listControllerData?.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  value={selectedControllerId}
                  onChange={(value) => setSelectedControllerId(value as string)}
                  style={{ width: 156 }}
                  allowClear
                  placeholder={t('common.selectController')}
                />

                <Select
                  options={listStoreData?.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  value={selectedStoreId}
                  onChange={(value) => setSelectedStoreId(value as string)}
                  style={{ width: 156 }}
                  allowClear
                  placeholder={t('common.selectStore')}
                />
              </Flex>
            )}
          />

          {listMachineLoading && <Skeleton active />}

          {!listMachineLoading && (
            <Box vertical gap={theme.custom.spacing.large} style={{ width: '100%' }}>
              <Table
                bordered
                dataSource={tableData || []}
                columns={columns}
                pagination={{
                  pageSize,
                  current: page,
                  total: listMachineData?.total,
                  onChange: (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                  },
                }}
                onChange={handleTableChange}
                style={{ width: '100%' }}
                scroll={{ x: 'max-content' }}
              />
            </Box>
          )}
        </Flex>
      </Flex>
    </PortalLayout>
  );
};
