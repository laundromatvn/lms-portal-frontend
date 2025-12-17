import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Table, Skeleton, notification, Typography } from 'antd';

import {
  AddCircle,
  PenNewSquare,
  LockKeyhole,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import {
  useListTenantMemberApi,
  type ListTenantMemberResponse,
} from '@shared/hooks/useListTenantMemberApi';

import { tenantStorage } from '@core/storage/tenantStorage';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';

import { ResetPasswordDrawer } from './ResetPasswordDrawer';
import { CreateNewMemberDrawer } from './CreateNewMemberDrawer';
import { ConfigDrawer } from './ConfigDrawer';

export const DrawerType = {
  CREATE_NEW_MEMBER: 'create_new_member',
  CONFIG: 'config',
  RESET_PASSWORD: 'reset_password',
} as const;

export type DrawerType = (typeof DrawerType)[keyof typeof DrawerType];

export const TenantMemberTableView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const tenant = tenantStorage.load();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDrawerType, setSelectedDrawerType] = useState<DrawerType | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const columns = [
    { title: t('common.email'), dataIndex: 'user_email', width: 400 },
    { title: t('common.phone'), dataIndex: 'user_phone', width: 200 },
    { title: t('common.role'), dataIndex: 'user_role', width: 200, render: (text: string) => <DynamicTag value={text} /> },
    { title: t('common.status'), dataIndex: 'user_status', width: 200, render: (text: string) => <DynamicTag value={text} /> },
    {
      title: t('common.actions'), dataIndex: 'actions', render: (text: string, record: any) => (
        <Flex gap={theme.custom.spacing.medium}>
          <Button
            onClick={() => {
              setIsDrawerOpen(true);
              setSelectedDrawerType(DrawerType.CONFIG);
              setSelectedUserId(record.user_id);
            }}
            icon={<PenNewSquare size={18} />}
          />
          <Button
            onClick={() => {
              setIsDrawerOpen(true);
              setSelectedDrawerType(DrawerType.RESET_PASSWORD);
              setSelectedUserId(record.user_id);
            }}
            icon={<LockKeyhole size={18} />}
          />
        </Flex>
      )
    },
  ];

  const {
    data: listTenantMemberData,
    loading: listTenantMemberLoading,
    error: listTenantMemberError,
    listTenantMember,
  } = useListTenantMemberApi<ListTenantMemberResponse>();

  const handleListTenantMember = () => {
    if (tenant) {
      listTenantMember({ tenant_id: tenant.id, page, page_size: pageSize });
    } else {
      listTenantMember({ page, page_size: pageSize });
    }
  }

  useEffect(() => {
    if (listTenantMemberError) {
      api.error({
        message: t('messages.listTenantMemberError'),
      });
    }
  }, [listTenantMemberError]);

  useEffect(() => {
    handleListTenantMember();
  }, [page, pageSize]);

  useEffect(() => {
    if (!isDrawerOpen) {
      handleListTenantMember();
    }
  }, [isDrawerOpen]);

  return (
    <PortalLayoutV2 title={t('navigation.tenantMembers')} onBack={() => navigate(-1)}>
      {contextHolder}

      <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        <Flex justify="flex-end" wrap gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Button
            type="primary"
            onClick={() => {
              setIsDrawerOpen(true);
              setSelectedDrawerType(DrawerType.CREATE_NEW_MEMBER);
            }}
            icon={<AddCircle />}
          >
            {t('common.createNewMember')}
          </Button>
        </Flex>

        {listTenantMemberLoading && <Skeleton active />}

        {!listTenantMemberLoading && (
          <Table
            bordered
            dataSource={listTenantMemberData?.data || []}
            columns={columns}
            loading={listTenantMemberLoading}
            style={{ width: '100%' }}
            pagination={{
              pageSize,
              current: page,
              total: listTenantMemberData?.total,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        )}
      </Box>

      {selectedDrawerType === DrawerType.CREATE_NEW_MEMBER && (
        <CreateNewMemberDrawer tenant_id={tenant?.id as string} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} onSuccess={() => {
          handleListTenantMember();
        }} />
      )}

      {selectedDrawerType === DrawerType.CONFIG && (
        <ConfigDrawer user_id={selectedUserId as string} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} onSuccess={() => {
          handleListTenantMember();
        }} />
      )}

      {selectedDrawerType === DrawerType.RESET_PASSWORD && (
        <ResetPasswordDrawer user_id={selectedUserId as string} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} onSuccess={() => {
          handleListTenantMember();
        }} />
      )}
    </PortalLayoutV2>
  );
};
