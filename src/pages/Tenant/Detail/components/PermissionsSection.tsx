import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  List,
  Input,
  Typography,
  Flex,
} from 'antd';

import {
  SearchOutlined,
} from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import {
  useGetTenantPermissionsApi,
  type GetTenantPermissionsRequest,
  type GetTenantPermissionsResponse,
} from '@shared/hooks/tenant/useGetTenantPermissionsApi';

import { type Tenant } from '@shared/types/tenant';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  tenant: Tenant;
}

export const PermissionsSection: React.FC<Props> = ({ tenant }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<GetTenantPermissionsRequest>({
    page: 1,
    page_size: 5,
    search: '',
    order_by: 'code',
    order_direction: 'asc',
  });

  const {
    getTenantPermissions,
    data: getTenantPermissionsData,
    loading: getTenantPermissionsLoading,
  } = useGetTenantPermissionsApi<GetTenantPermissionsResponse>();

  const handleGetTenantPermissions = () => {
    if (!tenant.id) return;

    getTenantPermissions(tenant.id, filters);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ ...filters, page: 1, search: debouncedSearch });
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedSearch]);

  useEffect(() => {
    handleGetTenantPermissions();
  }, [filters]);

  return (
    <BaseDetailSection
      title={t('navigation.permissions')}
      onRefresh={handleGetTenantPermissions}
    >
      <Flex justify="flex-start" align="center" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Input
          placeholder={t('common.search')}
          onChange={(e) => setDebouncedSearch(e.target.value)}
          allowClear
          prefix={<SearchOutlined />}
          style={{
            width: '100%',
            maxWidth: 312,
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        />
      </Flex>

      <List
        dataSource={getTenantPermissionsData?.data}
        loading={getTenantPermissionsLoading}
        style={{ width: '100%' }}
        pagination={{
          pageSize: filters.page_size,
          current: filters.page,
          total: getTenantPermissionsData?.total,
          showSizeChanger: true,
          showQuickJumper: false,
          style: { color: theme.custom.colors.text.tertiary },
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onShowSizeChange: (_page, newPageSize) => {
            setFilters({ ...filters, page: 1, page_size: newPageSize });
          },
          onChange: (page, pageSize) => {
            setFilters({ ...filters, page, page_size: pageSize });
          },
        }}
        renderItem={(item: any) => (
          <List.Item
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: theme.custom.spacing.xsmall,
              width: '100%',
              padding: theme.custom.spacing.small,
              marginBottom: theme.custom.spacing.medium,
              backgroundColor: theme.custom.colors.background.light,
              borderRadius: theme.custom.radius.medium,
              border: `1px solid ${theme.custom.colors.neutral[200]}`,
            }}
          >
            <Flex
              justify="space-between"
              align="flex-start"
              gap={theme.custom.spacing.medium}
              style={{ width: '100%' }}
            >
              <Typography.Text>{item.name}</Typography.Text>
              <DynamicTag value={item.is_enabled ? 'enabled' : 'disabled'} type="text" />
            </Flex>

            <Typography.Text type="secondary" ellipsis>
              {item.description}
            </Typography.Text>
          </List.Item>
        )}
      />
    </BaseDetailSection>
  );
};
