import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Dropdown,
  Flex,
  Input,
  notification,
  Table,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { MenuDots, TrashBinTrash } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import {
  useListTenantsApi,
  type ListTenantsRequest,
  type ListTenantsResponse,
} from '@shared/hooks/tenant/useListTenantsApi';
import { useDeleteTenantApi } from '@shared/hooks/tenant/useDeleteTenantApi';

import type { Tenant } from '@shared/types/tenant';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [filters, setFilters] = useState<ListTenantsRequest>({
    page: 1,
    page_size: 10,
    search: '',
    status: undefined,
    order_by: 'name',
    order_direction: 'asc',
  });

  const {
    data: listTenantsData,
    loading: listTenantsLoading,
    listTenants,
  } = useListTenantsApi<ListTenantsResponse>();
  const {
    deleteTenant,
    data: deleteTenantData,
  } = useDeleteTenantApi();

  const columns: ColumnsType<Tenant> = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      width: 256,
      sorter: true,
      sortOrder: filters.order_by === 'name' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/tenants/${record.id}/detail`)}>
          {record.name}
        </Typography.Link>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 128,
      sorter: true,
      sortOrder: filters.order_by === 'status' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => <DynamicTag value={record.status} type="text" />,
    },
    {
      title: t('common.email'),
      dataIndex: 'contact_email',
      key: 'contact_email',
      width: 256,
    },
    {
      title: t('common.phone'),
      dataIndex: 'contact_phone_number',
      key: 'contact_phone_number',
      width: 256,
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
                onClick: () => deleteTenant(record.id),
                icon: <TrashBinTrash />,
                disabled: !can('tenant.delete'),
                style: {
                  color: theme.custom.colors.danger.default,
                },
              }
            ],
          }}
        >
          <Button
            type="text"
            icon={<MenuDots weight="Bold" />}
            disabled={!can('tenant.delete')}
          />
        </Dropdown>
      )
    },
  ];

  const handleListTenants = () => {
    listTenants(filters);
  }

  useEffect(() => {
    handleListTenants();
  }, [filters]);

  useEffect(() => {
    if (!deleteTenantData) return;

    api.success({
      message: t('tenant.messages.deleteTenantSuccess'),
    });

    handleListTenants();
  }, [deleteTenantData]);

  return (
    <PortalLayoutV2 title={t('tenant.tenantList')} onBack={() => navigate(-1)}>
      {contextHolder}

      <BaseDetailSection>
        <Flex justify="space-between" align="center" gap={theme.custom.spacing.large} style={{ width: '100%' }}>
          <Input
            placeholder={t('common.search')}
            value={filters.search}
            allowClear
            prefix={<SearchOutlined />}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value });
            }}
            style={{
              width: '100%',
              maxWidth: 312,
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          />

          {can('tenant.create') && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => navigate('/tenants/add')}
              style={{
                backgroundColor: theme.custom.colors.background.light,
                color: theme.custom.colors.neutral.default,
              }}
            >
              {t('tenant.newTenant')}
            </Button>
          )}
        </Flex>

        <Table
          dataSource={listTenantsData?.data}
          loading={listTenantsLoading}
          columns={columns}
          pagination={{
            pageSize: filters.page_size,
            current: filters.page,
            total: listTenantsData?.total,
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
            const newFilters: ListTenantsRequest = {
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
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        />
      </BaseDetailSection>
    </PortalLayoutV2>
  );
};
