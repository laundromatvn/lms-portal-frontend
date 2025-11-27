import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, Input, List, notification, Spin, Typography, type FormInstance } from 'antd';

import { AddCircle, Refresh } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { type Permission } from '@shared/types/Permission';

import { useListPermissionApi, type ListPermissionResponse } from '@shared/hooks/permission/useListPermissionApi';
import { useUpdatePermissionApi, type UpdatePermissionResponse } from '@shared/hooks/permission/useUpdatePermissionApi';
import { useCreatePermissionApi, type CreatePermissionResponse } from '@shared/hooks/permission/useCreatePermissionApi';

import { Box } from '@shared/components/Box';
import LeftRightSection from '@shared/components/LeftRightSection';

import { CreateNewPermissionModal } from './CreateNewPermissionModal';
import { EditNewPermissionModal } from './EditNewPermissionModal';
import { DynamicTag } from '@shared/components/DynamicTag';

export const PermissionListView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [api, contextHolder] = notification.useNotification();

  const [isCreateNewPermissionModalOpen, setIsCreateNewPermissionModalOpen] = useState(false);
  const [isEditNewPermissionModalOpen, setIsEditNewPermissionModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
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
      listPermission({ page, page_size: pageSize, search });
    } else {
      listPermission({ page, page_size: pageSize });
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
      setIsEditNewPermissionModalOpen(false);
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
      setIsCreateNewPermissionModalOpen(false);
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
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      {contextHolder}

      <LeftRightSection
        left={(
          <Input.Search
            placeholder={t('common.search')}
            style={{ width: isMobile ? '100%' : 200 }}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
        )}
        right={(
          <Flex gap={theme.custom.spacing.small}>
            <Button
              type="text"
              icon={<Refresh size={18} />}
              onClick={handleListPermission}
              loading={listPermissionLoading}
            />
            
            <Button
              type="primary"
              icon={<AddCircle color={theme.custom.colors.text.inverted} />}
              onClick={() => setIsCreateNewPermissionModalOpen(true)}
            >
              {t('permission.addNewPermission')}
            </Button>
          </Flex>
        )}
      />

      <Box
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', overflow: 'auto' }}
        loading={listPermissionLoading}
      >
        <List
          dataSource={permissions}
          renderItem={(item) => (
            <List.Item>
              <Flex justify="space-between" align="flex-start" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
                <Typography.Link
                  onClick={() => {
                    setSelectedPermission(item);
                    setIsEditNewPermissionModalOpen(true);
                  }}
                >
                  {`${item.id}. ${item.name}`}
                </Typography.Link>

                <DynamicTag value={item.is_enabled ? 'enabled' : 'disabled'} />
              </Flex>
            </List.Item>
          )}
          style={{ width: '100%' }}
          pagination={{
            pageSize: pageSize,
            current: page,
            total: listPermissionData?.total || 0,
            onChange: (page) => setPage(page),
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total) => t('common.total', { total }),
          }}
        />
      </Box>

      <CreateNewPermissionModal
        isModalOpen={isCreateNewPermissionModalOpen}
        setIsModalOpen={setIsCreateNewPermissionModalOpen}
        onSave={onCreateNewPermission}
      />

      {selectedPermission && (
        <EditNewPermissionModal
          permission={selectedPermission}
          onSave={onUpdatePermission}
          isModalOpen={isEditNewPermissionModalOpen}
          setIsModalOpen={setIsEditNewPermissionModalOpen}
        />
      )}
    </Box>
  );
};
