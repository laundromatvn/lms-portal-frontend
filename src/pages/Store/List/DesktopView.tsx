import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Typography,
  Table,
  Input,
  notification,
  Dropdown,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { MenuDots, TrashBinTrash } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import { useListStoreApi, type ListStoreResponse } from '@shared/hooks/useListStoreApi';
import { useDeleteStoreApi, type DeleteStoreResponse } from '@shared/hooks/store/useDeleteStoreApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';
import { type Store } from '@shared/types/store';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  const columns: ColumnsType<Store> = [
    {
      title: t('common.tenantName'),
      dataIndex: 'tenant_name',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'tenant_name' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'name' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/stores/${record.id}/detail`)}>
          {record.name || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 72,
      sorter: true,
      sortOrder: orderBy === 'status' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => <DynamicTag value={record.status} type="text" />
    },
    {
      title: t('common.contactPhoneNumber'), dataIndex: 'contact_phone_number', width: 128,
      sorter: true,
      sortOrder: orderBy === 'contact_phone_number' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.address'),
      dataIndex: 'address',
      key: 'address',
      width: 400,
      sorter: true,
      sortOrder: orderBy === 'address' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
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
                onClick: () => deleteStore(record.id),
                icon: <TrashBinTrash />,
                disabled: !can('store.delete'),
                style: {
                  color: theme.custom.colors.danger.default,
                },
              },
            ]
          }}
          trigger={['click']}
        >
          <Button
            type="text"
            icon={<MenuDots weight="Bold" />}
            disabled={!can('store.delete')}
          />
        </Dropdown>
      ),
    },
  ];

  const {
    data: listStoreData,
    loading: listStoreLoading,
    error: listStoreError,
    listStore,
  } = useListStoreApi<ListStoreResponse>();
  const {
    deleteStore,
    data: deleteStoreData,
    error: deleteStoreError,
  } = useDeleteStoreApi<DeleteStoreResponse>();

  const handleListStore = () => {
    const searchValue = search && search.length >= 3 ? search : undefined;

    listStore({
      page,
      page_size: pageSize,
      search: searchValue,
      order_by: orderBy,
      order_direction: orderDirection,
    });
  }

  useEffect(() => {
    if (listStoreError) {
      api.error({
        message: t('store.listStoreError'),
      });
    }
  }, [listStoreError]);

  useEffect(() => {
    if (deleteStoreError) {
      api.error({
        message: t('store.deleteStoreError'),
      });
    }
  }, [deleteStoreError]);

  useEffect(() => {
    if (deleteStoreData) {
      api.success({
        message: t('store.deleteStoreSuccess'),
      });

      handleListStore();
    }
  }, [deleteStoreData]);

  useEffect(() => {
    handleListStore();
  }, [page, pageSize, search, orderBy, orderDirection]);

  return (
    <PortalLayoutV2
      title={t('common.storeList')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <Flex vertical style={{ height: '100%' }}>
        <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Flex align="center" justify="space-between" style={{ width: '100%' }}>
            <Input
              placeholder={t('common.search')}
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                maxWidth: 312,
                backgroundColor: theme.custom.colors.background.light,
                color: theme.custom.colors.neutral.default,
              }}
              allowClear
            />

            {can('store.create') && (
              <Button
                icon={<PlusOutlined />}
                onClick={() => navigate('/stores/add')}
                style={{
                  backgroundColor: theme.custom.colors.background.light,
                  color: theme.custom.colors.neutral.default,
                }}
              >
                {t('common.addStore')}
              </Button>
            )}
          </Flex>

          <Flex vertical style={{ width: '100%' }}>
            <Table
              bordered
              dataSource={listStoreData?.data || []}
              columns={columns}
              loading={listStoreLoading}
              pagination={{
                pageSize,
                current: page,
                total: listStoreData?.total,
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
      </Flex>
    </PortalLayoutV2>
  );
};
