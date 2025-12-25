import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  Typography,
  Switch,
  Dropdown,
  Button,
  notification,
  Flex,
  Input,
} from 'antd';
import { type ColumnsType } from 'antd/es/table';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { TrashBinTrash, MenuDots } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import { userStorage } from '@core/storage/userStorage';

import {
  useListPermissionGroupApi,
  type ListPermissionGroupRequest,
  type ListPermissionGroupResponse,
} from '@shared/hooks/permissionGroup/useListPermissionGroupApi';
import {
  useUpdatePermissionGroupApi,
  type UpdatePermissionGroupResponse,
} from '@shared/hooks/permissionGroup/useUpdatePermissionGroupApi';
import {
  useDeletePermissionGroupApi,
} from '@shared/hooks/permissionGroup/useDeletePermissionGroupApi';

import { type PermissionGroup } from '@shared/types/PermissionGroup';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const currentUser = userStorage.load();

  const [api, contextHolder] = notification.useNotification();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ListPermissionGroupRequest>({
    page: 1,
    page_size: 10,
    search: '',
    order_by: 'name',
    order_direction: 'asc',
  });

  const {
    listPermissionGroup,
    data: listPermissionGroupData,
    loading: listPermissionGroupLoading,
    error: listPermissionGroupError,
  } = useListPermissionGroupApi<ListPermissionGroupResponse>();
  const {
    updatePermissionGroup,
    data: updatePermissionGroupData,
    error: updatePermissionGroupError,
  } = useUpdatePermissionGroupApi<UpdatePermissionGroupResponse>();
  const {
    deletePermissionGroup,
    data: deletePermissionGroupData,
    error: deletePermissionGroupError,
  } = useDeletePermissionGroupApi<boolean>();

  const columns: ColumnsType<PermissionGroup> = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      width: 256,
      sorter: true,
      sortOrder: filters.order_by === 'name' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/permission-groups/${record.id}/detail`)}>
          {record.name}
        </Typography.Link>
      ),
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
      width: 128,
      render: (_: string, record: any) => (
        <Switch
          checked={record.is_enabled}
          disabled={!canUpdatePermissionGroup(record)}
          onChange={() => handleUpdatePermissionGroup(record)}
        />
      ),
    },
    {
      title: t('common.tenantName'),
      dataIndex: 'tenant_name',
      key: 'tenant_name',
      width: 156,
      render: (_: string, record: any) =>
        record.tenant_id ? (
          <Typography.Link onClick={() => navigate(`/tenant/list/${record.tenant_id}`)}>
            {record.tenant_name}
          </Typography.Link>
        ) : (
          <Typography.Text type="secondary">
            {t('common.unknown')}
          </Typography.Text>
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
                onClick: () => deletePermissionGroup(record.id),
                icon: <TrashBinTrash />,
                style: { color: theme.custom.colors.danger.default },
                disabled: !canDeletePermissionGroup(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MenuDots weight="Bold" />} />
        </Dropdown>
      ),
    },
  ];

  const canUpdatePermissionGroup = (permissionGroup: PermissionGroup) => {
    if (!can('permission_group.update')) return false;

    if (!currentUser) return false;

    if (!permissionGroup.tenant_id) {
      return currentUser.role === UserRoleEnum.ADMIN;
    }

    return true;
  }

  const canDeletePermissionGroup = (permissionGroup: PermissionGroup) => {
    if (!can('permission_group.delete')) return false;

    if (!currentUser) return false;

    if (!permissionGroup.tenant_id) {
      return currentUser.role === UserRoleEnum.ADMIN;
    }

    return true;
  }

  const handleListPermissionGroup = () => {
    listPermissionGroup({
      page: 1,
      page_size: 10,
      search: filters.search,
      order_by: filters.order_by,
      order_direction: filters.order_direction,
    });
  };

  const handleUpdatePermissionGroup = (permissionGroup: PermissionGroup) => {
    updatePermissionGroup(permissionGroup.id, {
      is_enabled: !permissionGroup.is_enabled,
    });
  }

  useEffect(() => {
    if (updatePermissionGroupData) {
      handleListPermissionGroup();
    }
  }, [updatePermissionGroupData]);

  useEffect(() => {
    if (updatePermissionGroupError) {
      api.error({
        message: t('permission.errors.updatePermissionGroupError'),
      });
    }
  }, [updatePermissionGroupError]);

  useEffect(() => {
    if (deletePermissionGroupData) {
      handleListPermissionGroup();
    }
  }, [deletePermissionGroupData]);

  useEffect(() => {
    if (deletePermissionGroupError) {
      api.error({
        message: t('permission.errors.deletePermissionGroupError'),
      });
    }
  }, [deletePermissionGroupError]);

  useEffect(() => {
    if (listPermissionGroupError) {
      api.error({
        message: t('permission.errors.listPermissionGroupError'),
      });
    }
  }, [listPermissionGroupError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: search,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    handleListPermissionGroup();
  }, [filters]);

  return (
    <BaseDetailSection
      title={t('navigation.groupPermissions')}
    >
      {contextHolder}

      <Flex
        justify="space-between"
        align="center"
        gap={theme.custom.spacing.medium}
        style={{ width: '100%' }}
      >
        <Input
          placeholder={t('common.search')}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          allowClear
          prefix={<SearchOutlined />}
          style={{
            width: '100%',
            maxWidth: 312,
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        />

        <Button
          icon={<PlusOutlined />}
          onClick={() => navigate('/permission-groups/add')}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        >
          {t('common.add')}
        </Button>
      </Flex>

      <Table
        bordered
        dataSource={listPermissionGroupData?.data}
        loading={listPermissionGroupLoading}
        columns={columns}
        pagination={{
          pageSize: filters.page_size,
          current: filters.page,
          total: listPermissionGroupData?.total,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          style: { color: theme.custom.colors.text.tertiary },
          onChange: (page, pageSize) => {
            setFilters({
              ...filters,
              page,
              page_size: pageSize,
            });
          },
        }}
        onChange={(pagination, _filters, sorter) => {
          const newFilters: ListPermissionGroupRequest = {
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
        style={{
          width: '100%',
          overflowX: 'auto',
          backgroundColor: theme.custom.colors.background.light,
          color: theme.custom.colors.neutral.default,
        }}
      />
    </BaseDetailSection>
  );
};
