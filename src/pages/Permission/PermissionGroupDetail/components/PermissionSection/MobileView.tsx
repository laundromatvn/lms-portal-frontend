import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Input,
  List,
  notification,
  Typography,
  Button,
} from 'antd';

import {
  SearchOutlined,
} from '@ant-design/icons';
import { TrashBinTrash } from '@solar-icons/react';

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

export const MobileView: React.FC<Props> = ({ permissionGroup, loading }) => {
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

  const canDeleteGroupPermission = (
    permissionGroup: PermissionGroup | null,
    permission: Permission,
  ) => {
    if (!can('permission_group.delete')) return false;
    if (!permissionGroup) return false;
    if (!permission) return false;

    return true;
  }

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
          size="large"
          placeholder={t('common.search')}
          onChange={(e) => setDebouncedSearch(e.target.value)}
          allowClear
          prefix={<SearchOutlined />}
          style={{
            width: '100%',
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        />
      </Flex>

      <List
        dataSource={listGroupPermissionsData?.data}
        loading={listGroupPermissionsLoading}
        style={{
          width: '100%',
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
            <Flex justify="space-between" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
              <Typography.Text
                ellipsis
                style={{
                  flex: 1,
                  minWidth: 0,
                  marginRight: theme.custom.spacing.xsmall,
                }}
              >
                {item.name}
              </Typography.Text>

              <Flex style={{ flexShrink: 0 }}>
                <DynamicTag value={item.is_enabled ? 'enabled' : 'disabled'} type="text" />
              </Flex>
            </Flex>

            <Typography.Text type="secondary">
              {item.description}
            </Typography.Text>

            <Flex justify="end" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
              {canDeleteGroupPermission(permissionGroup, item) && (
                <Button
                  type="text"
                  icon={<TrashBinTrash />}
                  style={{
                    color: theme.custom.colors.danger.default,
                    backgroundColor: theme.custom.colors.danger.light,
                    border: 'none',
                  }}
                >
                  {t('common.delete')}
                </Button>
              )}
            </Flex>
          </List.Item>
        )}

      />
    </BaseDetailSection>
  );
};