import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Flex,
  Input,
  Table,
  notification,
  Typography,
  Dropdown,
} from 'antd';
import { type ColumnsType } from 'antd/es/table';

import {
  SearchOutlined,
} from '@ant-design/icons';
import {
  MenuDots,
  TrashBinTrash,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import {
  useListGroupPermissionsApi,
  type ListGroupPermissionsRequest,
  type ListGroupPermissionsResponse,
} from '@shared/hooks/permissionGroup/useListGroupPermissionsApi';

import { type PermissionGroup } from '@shared/types/PermissionGroup';
import { type Permission } from '@shared/types/Permission';

import { DynamicTag } from '@shared/components/DynamicTag';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';

interface Props {
  permissionGroup: PermissionGroup | null;
  loading?: boolean;
}

export const DesktopView: React.FC<Props> = ({ permissionGroup, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<ListGroupPermissionsRequest>({
    page: 1,
    page_size: 5,
    search: '',
    order_by: 'name',
    order_direction: 'asc',
  });

  const {
    listGroupPermissions,
    data: listGroupPermissionsData,
    loading: listGroupPermissionsLoading,
    error: listGroupPermissionsError,
  } = useListGroupPermissionsApi<ListGroupPermissionsResponse>();

  const columns: ColumnsType<Permission> = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: filters.order_by === 'name' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
      key: 'description',
      render: (_: string, record: any) => (
        <Typography.Text type="secondary" ellipsis>
          {record.description}
        </Typography.Text>
      ),
    },
    {
      title: t('common.isEnabled'),
      dataIndex: 'is_enabled',
      key: 'is_enabled',
      sorter: true,
      sortOrder: filters.order_by === 'is_enabled' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <DynamicTag value={record.is_enabled ? 'enabled' : 'disabled'} type="text" />
      ),
    },
    {
      title: t('common.actions'),
      dataIndex: 'actions',
      key: 'actions',
      render: (_: string, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'delete',
                label: t('common.delete'),
                icon: <TrashBinTrash />,
                style: { color: theme.custom.colors.danger.default },
                disabled: !canDeleteGroupPermission(permissionGroup, record),
              },
            ],
          }}
        > 
          <Button type="text" icon={<MenuDots weight="Bold" />} />
        </Dropdown>
      ),
    },
  ];

  const canDeleteGroupPermission = (
    permissionGroup: PermissionGroup | null,
    permission: Permission,
  ) => {
    if (!can('permission_group.delete')) return false;
    if (!permissionGroup) return false;
    if (!permission) return false;

    return true;
  }

  const handleListGroupPermissions = () => {
    if (!permissionGroup) return;

    listGroupPermissions(permissionGroup.id, {
      page: filters.page,
      page_size: filters.page_size,
      search: debouncedSearch,
      order_by: filters.order_by,
      order_direction: filters.order_direction,
    });
  };

  useEffect(() => {
    if (listGroupPermissionsError) {
      api.error({
        message: t('permission.errors.listGroupPermissionsError'),
      });
    }
  }, [listGroupPermissionsError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ 
        ...filters,
        page: 1,
        search: debouncedSearch,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedSearch]);

  useEffect(() => {
    handleListGroupPermissions();
  }, [filters]);

  return (
    <BaseDetailSection title={t('navigation.permissions')}>
      {contextHolder}

      <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Input
          placeholder={t('common.search')}
          onChange={(e) => setDebouncedSearch(e.target.value)}
          allowClear
          prefix={<SearchOutlined />}
          style={{
            width: '100%',
            maxWidth: 312,
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        />
      </Flex>

      <Table
        dataSource={listGroupPermissionsData?.data}
        loading={listGroupPermissionsLoading}
        columns={columns}
        style={{
          width: '100%',
          overflowX: 'auto',
          backgroundColor: theme.custom.colors.background.light,
          color: theme.custom.colors.neutral.default,
        }}
        pagination={{
          pageSize: filters.page_size,
          current: filters.page,
          total: listGroupPermissionsData?.total,
          style: { color: theme.custom.colors.text.tertiary },
          showSizeChanger: true,
          showQuickJumper: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            setFilters({ ...filters, page, page_size: pageSize });
          },
          onShowSizeChange: (_page, newPageSize) => {
            setFilters({ ...filters, page: 1, page_size: newPageSize });
          },
        }}
        onChange={(pagination, _filters, sorter) => {
          const newFilters: ListGroupPermissionsRequest = {
            ...filters,
            page: pagination.current || 1,
            page_size: pagination.pageSize || 10,
          };

          if (sorter && !Array.isArray(sorter)) {
            const field = ('field' in sorter && sorter.field) || ('columnKey' in sorter && sorter.columnKey);
            if (field && sorter.order) {
              newFilters.order_by = field as string;
              newFilters.order_direction = sorter.order === 'ascend' ? 'asc' : 'desc';
            } else if (sorter.order === null || sorter.order === undefined) {
              newFilters.order_by = undefined;
              newFilters.order_direction = undefined;
            }
          }

          setFilters(newFilters);
        }}
        onRow={() => {
          return {
            style: {
              backgroundColor: theme.custom.colors.background.light,
            },
          };
        }}
      />
    </BaseDetailSection>
  );
};