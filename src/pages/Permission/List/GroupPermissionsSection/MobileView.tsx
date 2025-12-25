import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  List,
  Typography,
  Button,
  notification,
  Flex,
  Input,
  Dropdown,
} from 'antd';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { AltArrowDown, TrashBinTrash } from '@solar-icons/react';

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

import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

export const MobileView: React.FC = () => {
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
        gap={theme.custom.spacing.small}
        style={{ width: '100%' }}
      >
        <Input
          size="large"
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
          shape="circle"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => { }}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        />
      </Flex>

      <List
        dataSource={listPermissionGroupData?.data || []}
        loading={listPermissionGroupLoading}
        style={{
          width: '100%',
          backgroundColor: theme.custom.colors.background.light,
          color: theme.custom.colors.neutral.default,
        }}
        pagination={{
          pageSize: filters.page_size,
          current: filters.page,
          total: listPermissionGroupData?.total,
          showSizeChanger: true,
          showQuickJumper: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            setFilters({ ...filters, page, page_size: pageSize });
          },
          style: { color: theme.custom.colors.text.tertiary },
        }}
        renderItem={(item) => (
          <List.Item
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: theme.custom.spacing.small,
              width: '100%',
              padding: theme.custom.spacing.small,
              marginBottom: theme.custom.spacing.medium,
              backgroundColor: theme.custom.colors.background.light,
              borderRadius: theme.custom.radius.medium,
              border: `1px solid ${theme.custom.colors.neutral[200]}`,
            }}
          >
            <Flex
              vertical
              gap={theme.custom.spacing.xsmall}
              style={{ width: '100%' }}
              onClick={() => navigate(`/permission/list/group-permissions/${item.id}/detail`)}
            >
              <Flex justify="space-between" align="center" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                <Typography.Text>{item.name}</Typography.Text>
                <DynamicTag value={item.is_enabled ? 'enabled' : 'disabled'} />
              </Flex>

              {item.tenant_id && (
                <Typography.Text type="secondary" ellipsis>
                  {item.tenant_name}
                </Typography.Text>
              )}

              <Typography.Text type="secondary" ellipsis>
                {item.description}
              </Typography.Text>
            </Flex>

            <Flex
              justify="end"
              align="center"
              gap={theme.custom.spacing.small}
              style={{ width: '100%' }}
            >
              {!item.is_enabled && (
                <Button
                  onClick={() => handleUpdatePermissionGroup(item)}
                  disabled={!canUpdatePermissionGroup(item)}
                  style={{
                    color: theme.custom.colors.neutral.default,
                    backgroundColor: theme.custom.colors.background.light,
                  }}
                >
                  {t('common.enable')}
                </Button>
              )}

              {item.is_enabled && (
                <Button
                  onClick={() => handleUpdatePermissionGroup(item)}
                  disabled={!canUpdatePermissionGroup(item)}
                  style={{
                    color: theme.custom.colors.neutral.default,
                    backgroundColor: theme.custom.colors.background.light,
                  }}
                >
                  {t('common.disable')}
                </Button>
              )}

              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'delete',
                      label: t('common.delete'),
                      onClick: () => deletePermissionGroup(item.id),
                      icon: <TrashBinTrash />,
                      style: { color: theme.custom.colors.danger.default },
                      disabled: !canDeletePermissionGroup(item),
                    },
                  ],
                }}
                trigger={['click']}
              >
                <Button
                  icon={<AltArrowDown />}
                  style={{
                    color: theme.custom.colors.neutral.default,
                    backgroundColor: theme.custom.colors.background.light,
                  }}
                />
              </Dropdown>
            </Flex>
          </List.Item>
        )
        }
      />
    </BaseDetailSection >
  );
};
