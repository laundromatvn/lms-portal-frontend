import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Flex,
  Input,
  List,
  notification,
  Typography,
  type FormInstance,
} from 'antd';

import {
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import { type Permission } from '@shared/types/Permission';

import {
  useListPermissionApi,
  type ListPermissionResponse,
} from '@shared/hooks/permission/useListPermissionApi';
import {
  useUpdatePermissionApi,
  type UpdatePermissionResponse,
} from '@shared/hooks/permission/useUpdatePermissionApi';
import {
  useCreatePermissionApi,
  type CreatePermissionResponse,
} from '@shared/hooks/permission/useCreatePermissionApi';

import { DynamicTag } from '@shared/components/DynamicTag';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { CreateNewPermissionDrawer } from './components/CreateNewPermissionDrawer';
import { EditPermissionDrawer } from './components/EditPermissionDrawer';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [api, contextHolder] = notification.useNotification();

  const [isCreateNewPermissionDrawerOpen, setIsCreateNewPermissionDrawerOpen] = useState(false);
  const [isEditNewPermissionDrawerOpen, setIsEditNewPermissionDrawerOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [search, setSearch] = useState('');
  const prevSearchRef = useRef<string>('');

  const {
    data: listPermissionData,
    loading: listPermissionLoading,
    listPermission,
  } = useListPermissionApi<ListPermissionResponse>();

  const {
    updatePermission,
    data: updatePermissionData,
    error: updatePermissionError,
  } = useUpdatePermissionApi<UpdatePermissionResponse>();

  const {
    createPermission,
    data: createPermissionData,
    error: createPermissionError,
  } = useCreatePermissionApi<CreatePermissionResponse>();

  const handleListPermission = () => {
    if (!search || search.length >= 3) {
      listPermission({
        page,
        page_size: pageSize,
        search,
        order_by: 'id',
        order_direction: 'desc',
      });
    } else {
      listPermission({
        page,
        page_size: pageSize,
        order_by: 'id',
        order_direction: 'desc',
      });
    }
  }

  const onUpdatePermission = (form: FormInstance) => {
    updatePermission(selectedPermission?.id as string, {
      name: form.getFieldValue('name'),
      code: form.getFieldValue('code'),
      description: form.getFieldValue('description'),
      is_enabled: form.getFieldValue('is_enabled'),
    });
  }

  const onCreateNewPermission = (form: FormInstance) => {
    createPermission({
      name: form.getFieldValue('name'),
      code: form.getFieldValue('code'),
      description: form.getFieldValue('description'),
      is_enabled: form.getFieldValue('is_enabled'),
    });
  }

  useEffect(() => {
    if (updatePermissionData) {
      setIsEditNewPermissionDrawerOpen(false);
      setPage(1);
      setPermissions([]);
      handleListPermission();

      api.success({
        message: t('permission.messages.updatePermissionSuccess'),
      });
    }
  }, [updatePermissionData]);

  useEffect(() => {
    if (updatePermissionError) {
      api.error({
        message: t('permission.messages.updatePermissionError'),
      });
    }
  }, [updatePermissionError]);

  useEffect(() => {
    if (createPermissionData) {
      setIsCreateNewPermissionDrawerOpen(false);
      setPage(1);
      setPermissions([]);
      handleListPermission();

      api.success({
        message: t('permission.messages.createPermissionSuccess'),
      });
    }
  }, [createPermissionData]);

  useEffect(() => {
    if (createPermissionError) {
      api.error({
        message: t('permission.messages.createPermissionError'),
      });
    }
  }, [createPermissionError]);

  useEffect(() => {
    if (prevSearchRef.current !== search) {
      setPermissions([]);
      setPage(1);
      prevSearchRef.current = search;
    }
  }, [search]);

  useEffect(() => {
    if (listPermissionData) {
      setPermissions(listPermissionData.data);
    }
  }, [listPermissionData]);

  useEffect(() => {
    handleListPermission();
  }, [page, search]);

  return (
    <BaseDetailSection title={t('navigation.permissions')}>
      {contextHolder}

      <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Input
          placeholder={t('common.search')}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          prefix={<SearchOutlined />}
          style={{
            width: '100%',
            maxWidth: 312,
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        />

        <Flex gap={theme.custom.spacing.small}>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setIsCreateNewPermissionDrawerOpen(true)}
            style={{
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          >
            {t('permission.addNewPermission')}
          </Button>
        </Flex>
      </Flex>

      <List
        dataSource={permissions}
        loading={listPermissionLoading}
        style={{ width: '100%' }}
        pagination={{
          pageSize: pageSize,
          current: page,
          total: listPermissionData?.total || 0,
          style: { color: theme.custom.colors.text.tertiary },
          showSizeChanger: true,
          showQuickJumper: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onShowSizeChange: (_page, newPageSize) => {
            setPage(1);
            setPageSize(newPageSize);
          },
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
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
            <Flex justify="space-between" align="flex-start" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
              <Typography.Link onClick={() => {
                setSelectedPermission(item);
                setIsEditNewPermissionDrawerOpen(true);
              }}>
                {`${item.id}. ${item.name}`}
              </Typography.Link>

              <DynamicTag value={item.is_enabled ? 'enabled' : 'disabled'} type="text" />
            </Flex>

            <Typography.Text
              type="secondary"
              style={{ fontSize: theme.custom.fontSize.xsmall }}
              ellipsis
            >
              {item.description}
            </Typography.Text>
          </List.Item>
        )}
      />

      <CreateNewPermissionDrawer
        open={isCreateNewPermissionDrawerOpen}
        onClose={() => setIsCreateNewPermissionDrawerOpen(false)}
        onSave={onCreateNewPermission}
      />

      {selectedPermission && (
        <EditPermissionDrawer
          permission={selectedPermission}
          onSave={onUpdatePermission}
          open={isEditNewPermissionDrawerOpen}
          onClose={() => setIsEditNewPermissionDrawerOpen(false)}
        />
      )}
    </BaseDetailSection>
  );
};