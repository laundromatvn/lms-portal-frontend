import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Typography,
  Table,
  notification,
  Dropdown,
  Input,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { TrashBinTrash, MenuDots } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import { useListControllerApi, type ListControllerResponse } from '@shared/hooks/useListControllerApi';
import { useDeleteControllerApi } from '@shared/hooks/useDeleteControllerApi';

import type { Controller } from '@shared/types/Controller';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Box } from '@shared/components/Box';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [orderBy, setOrderBy] = useState('store_name');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');

  const columns: ColumnsType<Controller> = [
    {
      title: t('common.storeName'),
      dataIndex: 'store_name',
      width: 196,
      sorter: true,
      sortOrder: orderBy === 'store_name' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/stores/${record.store_id}/detail`)}>
          {record.store_name || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.deviceId'),
      dataIndex: 'device_id',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'device_id' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/controllers/${record.id}/detail`)}>
          {record.device_id || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.controllerName'),
      dataIndex: 'name',
      width: 196,
      sorter: true,
      sortOrder: orderBy === 'name' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/controllers/${record.id}/detail`)}>
          {record.name || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.totalRelays'),
      dataIndex: 'total_relays',
      width: 48,
      sorter: true,
      sortOrder: orderBy === 'total_relays' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'status' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => <DynamicTag value={record.status} type="text" />,
    },
    {
      title: t('common.firmware'),
      dataIndex: 'firmware_name',
      width: 128,
      render: (_: string, record: any) => (
        <Typography.Link
          disabled={!record.firmware_id}
          onClick={() => navigate(`/firmware/${record.firmware_id}/detail`)}
        >
          {record.firmware_id ? `${record.firmware_name} (${record.firmware_version})` : t('common.unknown')}
        </Typography.Link>
      ),
    },
    {
      title: t('common.actions'),
      dataIndex: 'actions',
      width: 128,
      render: (_: string, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'delete',
                label: t('common.delete'),
                onClick: () => deleteController(record.id),
                icon: <TrashBinTrash />,
                style: { color: theme.custom.colors.danger.default },
                disabled: !can('controller.delete'),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button
            type="text"
            icon={<MenuDots weight="Bold" />}
          />
        </Dropdown>
      ),
    },
  ];

  const {
    data: listControllerData,
    loading: listControllerLoading,
    error: listControllerError,
    listController,
  } = useListControllerApi<ListControllerResponse>();
  const {
    deleteController,
    data: deleteControllerData,
    error: deleteControllerError,
    loading: deleteControllerLoading,
  } = useDeleteControllerApi<void>();

  const handleListController = () => {
    listController({
      page,
      page_size: pageSize,
      order_by: orderBy,
      order_direction: orderDirection,
      search: debouncedSearch,
    });
  }

  useEffect(() => {
    if (!deleteControllerData) return;

    api.success({
      message: t('controller.deleteControllerSuccess'),
    });
    handleListController();
  }, [deleteControllerData]);

  useEffect(() => {
    if (deleteControllerError) {
      api.error({
        message: t('controller.deleteControllerError'),
      });
    }
  }, [deleteControllerError]);

  useEffect(() => {
    if (listControllerError) {
      api.error({
        message: t('controller.listControllerError'),
      });
    }
  }, [listControllerError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    handleListController();
  }, [page, pageSize, orderBy, orderDirection, debouncedSearch]);

  return (
    <PortalLayoutV2
      title={t('common.controllers')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%', overflowX: 'hidden' }}>
        <Flex align="center" justify="space-between" wrap gap={theme.custom.spacing.small} style={{ width: '100%' }}>
          <Input
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 312,
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
            allowClear
            prefix={<SearchOutlined />}
          />

          {can('controller.create') && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => navigate('/controllers/abandoned')}
              style={{
                backgroundColor: theme.custom.colors.background.light,
                color: theme.custom.colors.neutral.default,
              }}
            >
              {t('controller.addController')}
            </Button>
          )}
        </Flex>

        <Flex vertical style={{ width: '100%', overflowX: 'auto' }}>
          <Table
            bordered
            dataSource={listControllerData?.data || []}
            columns={columns}
            loading={listControllerLoading || deleteControllerLoading}
            pagination={{
              pageSize,
              current: page,
              total: listControllerData?.total,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              style: { color: theme.custom.colors.text.tertiary },
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
        </Flex>
      </Box>
    </PortalLayoutV2>
  );
};
