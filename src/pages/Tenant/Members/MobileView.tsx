import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Dropdown,
  Flex,
  List,
  Typography,
  Input,
  notification,
} from 'antd';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import {
  AltArrowDown,
  Shop2,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import {
  useListTenantMemberApi,
  type ListTenantMemberRequest,
  type ListTenantMemberResponse,
} from '@shared/hooks/useListTenantMemberApi';

import {
  useDeleteTenantMemberApi,
  type DeleteTenantMemberResponse,
} from '@shared/hooks/tenant/useDeleteTenantMemberApi';

import { type Tenant } from '@shared/types/tenant';

import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { ResetPasswordDrawer } from './components/ResetPasswordDrawer';
import { CreateNewMemberDrawer } from './components/CreateNewMemberDrawer';
import { ConfigDrawer } from './components/ConfigDrawer';
import { AssignMemberToStoresDrawer } from './components/AssignMemberToStoresDrawer';
import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

export const DrawerType = {
  CREATE_NEW_MEMBER: 'create_new_member',
  EDIT: 'edit',
  RESET_PASSWORD: 'reset_password',
  ASSIGN_MEMBER_TO_STORES: 'assign_member_to_stores',
} as const;

export type DrawerType = (typeof DrawerType)[keyof typeof DrawerType];

export type Props = {
  tenant: Tenant;
}

export const MobileView: React.FC<Props> = ({ tenant }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const can = useCan();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [filters, setFilters] = useState<ListTenantMemberRequest>({
    page: 1,
    page_size: 10,
    search: '',
    order_by: 'user_email',
    order_direction: 'asc',
  });
  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDrawerType, setSelectedDrawerType] = useState<DrawerType | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const getActionItems = (record: any) => {
    const items = [
      {
        key: 'assign_member_to_stores',
        label: t('tenant.members.addToStores'),
        visible: can("tenant_member.create") && record.user_role !== UserRoleEnum.TENANT_ADMIN,
        onClick: () => {
          setIsDrawerOpen(true);
          setSelectedDrawerType(DrawerType.ASSIGN_MEMBER_TO_STORES);
          setSelectedUserId(record.user_id);
        },
      },
      {
        key: 'edit',
        label: t('common.edit'),
        visible: can("tenant_member.update"),
        onClick: () => {
          setIsDrawerOpen(true);
          setSelectedDrawerType(DrawerType.EDIT);
          setSelectedUserId(record.user_id);
        },
      },
      {
        key: 'reset_password',
        label: t('common.resetPassword'),
        visible: can("tenant_member.update"),
        onClick: () => {
          setIsDrawerOpen(true);
          setSelectedDrawerType(DrawerType.RESET_PASSWORD);
          setSelectedUserId(record.user_id);
        },
      },
      {
        key: 'delete',
        label: t('common.delete'),
        visible: can("tenant_member.delete"),
        onClick: () => deleteTenantMember(record.id as string),
        style: { color: theme.custom.colors.danger.default },
      },
    ];


    return items.filter((item: any) => item.visible);
  }

  const {
    data: listTenantMemberData,
    loading: listTenantMemberLoading,
    error: listTenantMemberError,
    listTenantMember,
  } = useListTenantMemberApi<ListTenantMemberResponse>();

  const {
    data: deleteTenantMemberData,
    error: deleteTenantMemberError,
    deleteTenantMember,
  } = useDeleteTenantMemberApi<DeleteTenantMemberResponse>();

  const handleListTenantMember = () => {
    if (tenant) {
      listTenantMember({
        tenant_id: tenant.id,
        page: filters.page,
        page_size: filters.page_size,
        search: filters.search,
        order_by: filters.order_by,
        order_direction: filters.order_direction,
      });
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
    if (deleteTenantMemberError) {
      api.error({
        message: t('messages.deleteTenantMemberError'),
      });
    }
  }, [deleteTenantMemberError]);

  useEffect(() => {
    if (deleteTenantMemberData) {
      handleListTenantMember();
    }
  }, [deleteTenantMemberData]);

  useEffect(() => {
    handleListTenantMember();
  }, [tenant, filters]);

  useEffect(() => {
    if (!isDrawerOpen) {
      handleListTenantMember();
    }
  }, [isDrawerOpen]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: search, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <PortalLayoutV2
      title={t('navigation.tenantMembers')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <BaseDetailSection>
        <Flex gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
          <Input
            placeholder={t('common.search')}
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{
              width: '100%',
              maxWidth: 312,
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          />

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
            pageSize: filters.page_size,
            current: filters.page,
            total: listTenantMemberData?.total,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            style: { color: theme.custom.colors.text.tertiary },
            onChange: (page, pageSize) => {
              setFilters({ ...filters, page, page_size: pageSize });
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

              <Flex justify="flex-end" gap={theme.custom.spacing.small} style={{ width: '100%', overflow: 'auto' }}>
                {can("tenant_member.create") && item.user_role !== UserRoleEnum.TENANT_ADMIN && (
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
                  >
                    {t('tenant.members.addToStores')}
                  </Button>
                )}

                <Dropdown
                  menu={{
                    items: getActionItems(item),
                  }}
                  trigger={['click']}
                >
                  <Button
                    icon={<AltArrowDown size={18} />}
                    style={{
                      backgroundColor: theme.custom.colors.background.light,
                      color: theme.custom.colors.neutral.default,
                    }}
                  />
                </Dropdown>
              </Flex>
            </List.Item>
          )}
        />

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

        {selectedDrawerType === DrawerType.EDIT && (
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
      </BaseDetailSection>
    </PortalLayoutV2>
  );
};
