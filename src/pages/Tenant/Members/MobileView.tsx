import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  List,
  Typography,
  notification,
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import {
  LockKeyhole,
  PenNewSquare,
  Shop2,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListTenantMemberApi,
  type ListTenantMemberResponse,
} from '@shared/hooks/useListTenantMemberApi';

import { tenantStorage } from '@core/storage/tenantStorage';

import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Box } from '@shared/components/Box';

import { ResetPasswordDrawer } from './components/ResetPasswordDrawer';
import { CreateNewMemberDrawer } from './components/CreateNewMemberDrawer';
import { ConfigDrawer } from './components/ConfigDrawer';
import { AssignMemberToStoresDrawer } from './components/AssignMemberToStoresDrawer';

export const DrawerType = {
  CREATE_NEW_MEMBER: 'create_new_member',
  CONFIG: 'config',
  RESET_PASSWORD: 'reset_password',
  ASSIGN_MEMBER_TO_STORES: 'assign_member_to_stores',
} as const;

export type DrawerType = (typeof DrawerType)[keyof typeof DrawerType];

export const MobileView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const tenant = tenantStorage.load();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDrawerType, setSelectedDrawerType] = useState<DrawerType | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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

      <Flex vertical style={{ height: '100%' }}>
        <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Flex justify="flex-end" wrap gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
            <Button
              size="large"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsDrawerOpen(true);
                setSelectedDrawerType(DrawerType.CREATE_NEW_MEMBER);
              }}
              style={{
                backgroundColor: theme.custom.colors.background.light,
                color: theme.custom.colors.neutral.default,
              }}
            />
          </Flex>

          <List
            dataSource={listTenantMemberData?.data || []}
            loading={listTenantMemberLoading}
            style={{ width: '100%' }}
            pagination={{
              pageSize,
              current: page,
              total: listTenantMemberData?.total,
              showSizeChanger: false,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              style: { color: theme.custom.colors.text.tertiary },
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            renderItem={(item) => (
              <List.Item
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: theme.custom.spacing.small,
                  padding: theme.custom.spacing.medium,
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
                >
                  <Flex justify="space-between" style={{ width: '100%' }}>
                    <Typography.Text>{item.user_email}</Typography.Text>
                    <DynamicTag value={item.user_status} type="text" />
                  </Flex>

                  <Flex justify="space-between" style={{ width: '100%' }}>
                    <Typography.Text type="secondary">{item.user_phone}</Typography.Text>
                    <DynamicTag value={item.user_role} type="text" />
                  </Flex>
                </Flex>

                <Flex justify="flex-end" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
                  <Button
                    icon={<LockKeyhole size={18} />}
                    onClick={() => {
                      setIsDrawerOpen(true);
                      setSelectedDrawerType(DrawerType.RESET_PASSWORD);
                      setSelectedUserId(item.user_id);
                    }}
                    style={{
                      backgroundColor: theme.custom.colors.background.light,
                      color: theme.custom.colors.neutral.default,
                    }}
                  />

                  <Button
                    onClick={() => {
                      setIsDrawerOpen(true);
                      setSelectedDrawerType(DrawerType.CONFIG);
                      setSelectedUserId(item.user_id);
                    }}
                    icon={<PenNewSquare size={18} />}
                    style={{
                      backgroundColor: theme.custom.colors.background.light,
                      color: theme.custom.colors.neutral.default,
                    }}
                  />

                  {item.user_role === UserRoleEnum.TENANT_STAFF && (
                    <Button
                      icon={<Shop2 size={18} />}
                      onClick={() => {
                        setIsDrawerOpen(true);
                        setSelectedDrawerType(DrawerType.ASSIGN_MEMBER_TO_STORES);
                        setSelectedUserId(item.user_id);
                      }}
                      style={{
                        backgroundColor: theme.custom.colors.background.light,
                        color: theme.custom.colors.neutral.default,
                      }}
                    />
                  )}
                </Flex>
              </List.Item>
            )}
          />
        </Box>
      </Flex>

      {selectedDrawerType === DrawerType.CREATE_NEW_MEMBER && (
        <CreateNewMemberDrawer
          tenant_id={tenant?.id as string}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          onSuccess={() => {
            handleListTenantMember();
          }}
        />
      )}

      {selectedDrawerType === DrawerType.CONFIG && (
        <ConfigDrawer
          user_id={selectedUserId as string}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          onSuccess={() => {
            handleListTenantMember();
          }}
        />
      )}

      {selectedDrawerType === DrawerType.RESET_PASSWORD && (
        <ResetPasswordDrawer
          user_id={selectedUserId as string}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          onSuccess={() => {
            handleListTenantMember();
          }}
        />
      )}

      {selectedDrawerType === DrawerType.ASSIGN_MEMBER_TO_STORES && (
        <AssignMemberToStoresDrawer
          user_id={selectedUserId as string}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          onSuccess={() => {
            handleListTenantMember();
          }}
        />
      )}
    </PortalLayoutV2>
  );
};
