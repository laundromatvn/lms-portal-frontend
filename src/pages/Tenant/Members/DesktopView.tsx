import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Table,
  Dropdown,
  notification,
  Input,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import {
  AddCircle,
  MenuDots,
} from '@solar-icons/react';

import { SearchOutlined } from '@ant-design/icons';

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
import { type TenantMember } from '@shared/types/TenantMember';

import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { ResetPasswordDrawer } from './components/ResetPasswordDrawer';
import { CreateNewMemberDrawer } from './components/CreateNewMemberDrawer';
import { ConfigDrawer } from './components/ConfigDrawer';
import { AssignMemberToStoresDrawer } from './components/AssignMemberToStoresDrawer';

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

export const DesktopView: React.FC<Props> = ({ tenant }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const can = useCan();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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

  const columns: ColumnsType<TenantMember> = [
    {
      title: t('common.email'),
      dataIndex: 'user_email',
      width: 256,
      sorter: true,
      sortOrder: filters.order_by === 'user_email' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.phone'),
      dataIndex: 'user_phone',
      width: 256,
      sorter: true,
      sortOrder: filters.order_by === 'user_phone' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.role'),
      dataIndex: 'user_role',
      width: 128,
      sorter: true,
      sortOrder: filters.order_by === 'user_role' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (text: string) => <DynamicTag value={text} type="text" />,
    },
    {
      title: t('common.status'),
      dataIndex: 'user_status',
      width: 128,
      render: (text: string) => <DynamicTag value={text} type="text" />,
    },
    {
      title: t('common.actions'), dataIndex: 'actions', render: (_: string, record: any) => (
        <Flex gap={theme.custom.spacing.medium}>
          <Dropdown
            menu={{ items: getActionItems(record) }}
            trigger={['click']}
          >
            <Button type="text" icon={<MenuDots />} />
          </Dropdown>
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: search, page: 1 }));
      setPage(1);
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
        <Flex justify="space-between" wrap gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
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
            icon={<AddCircle />}
            onClick={() => {
              setIsDrawerOpen(true);
              setSelectedDrawerType(DrawerType.CREATE_NEW_MEMBER);
            }}
            style={{
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          >
            {t('common.createNewMember')}
          </Button>
        </Flex>

        <Table
          bordered
          dataSource={listTenantMemberData?.data || []}
          columns={columns}
          loading={listTenantMemberLoading}
          style={{ width: '100%', overflowX: 'auto' }}
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
          onRow={() => {
            return {
              style: {
                backgroundColor: theme.custom.colors.background.light,
              },
            };
          }}
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
