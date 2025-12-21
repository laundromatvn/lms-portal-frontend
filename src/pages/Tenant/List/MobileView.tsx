import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Input,
  notification,
  List,
  Typography,
  Popconfirm,
} from 'antd';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { TrashBinTrash } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import {
  useListTenantsApi,
  type ListTenantsRequest,
  type ListTenantsResponse,
} from '@shared/hooks/tenant/useListTenantsApi';
import { useDeleteTenantApi } from '@shared/hooks/tenant/useDeleteTenantApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

export const MobileView: React.FC = () => {
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
        <Flex align="center" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
          <Input
            size="large"
            placeholder={t('common.search')}
            value={filters.search}
            allowClear
            prefix={<SearchOutlined />}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value });
            }}
            style={{
              width: '100%',
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          />

          {can('tenant.create') && (
            <Button
              size="large"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => navigate('/tenants/add')}
              style={{
                backgroundColor: theme.custom.colors.background.light,
                color: theme.custom.colors.neutral.default,
              }}
            />
          )}
        </Flex>

        <List
          dataSource={listTenantsData?.data || []}
          loading={listTenantsLoading}
          pagination={{
            pageSize: filters.page_size,
            current: filters.page || 1,
            total: listTenantsData?.total,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            style: { color: theme.custom.colors.text.tertiary },
            onChange: (page, pageSize) => {
              setFilters({ ...filters, page, page_size: pageSize });
            },
          }}
          style={{ width: '100%' }}
          renderItem={(item) => (
            <List.Item
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: theme.custom.spacing.small,
                width: '100%',
                padding: theme.custom.spacing.small,
                marginBottom: theme.custom.spacing.small,
                backgroundColor: theme.custom.colors.background.light,
                borderRadius: theme.custom.radius.medium,
                border: `1px solid ${theme.custom.colors.neutral[200]}`,
              }}
            >
              <Flex vertical style={{ width: '100%' }} onClick={() => navigate(`/tenants/${item.id}/detail`)}>
                <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                  <Typography.Text>{item.name}</Typography.Text>
                  <DynamicTag value={item.status} type="text" />
                </Flex>

                <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                  <Typography.Text type="secondary">{item.contact_email}</Typography.Text>
                  <Typography.Text type="secondary">{item.contact_phone_number}</Typography.Text>
                </Flex>
              </Flex>

              <Flex justify="end" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                {can('tenant.delete') && (
                  <Popconfirm
                    title={t('tenant.deleteTenantConfirm')}
                    onConfirm={() => deleteTenant(item.id)}
                    onCancel={() => { }}
                    okText={t('common.delete')}
                    cancelText={t('common.cancel')}
                    placement="topLeft"
                  >
                    <Button
                      icon={<TrashBinTrash />}
                      style={{
                        color: theme.custom.colors.danger.default,
                        backgroundColor: theme.custom.colors.danger.light,
                        border: 'none',
                      }}
                    >
                      {t('common.delete')}
                    </Button>
                  </Popconfirm>
                )}
              </Flex>
            </List.Item>
          )}
        />
      </BaseDetailSection>
    </PortalLayoutV2>
  );
};
