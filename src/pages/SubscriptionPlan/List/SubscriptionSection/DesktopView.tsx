import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  Dropdown,
  Button,
  Flex,
  Input,
  Typography,
  notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import {
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  MenuDots,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import {
  useListSubscriptionApi,
  type ListSubscriptionResponse,
  type ListSubscriptionRequest,
} from '@shared/hooks/subscription/useListSubscriptionApi';

import { type Subscription } from '@shared/types/Subscription';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { formatDateTime } from '@shared/utils/date';
import { DynamicTag } from '@shared/components/DynamicTag';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ListSubscriptionRequest>({
    page: 1,
    page_size: 10,
    search: '',
    order_by: 'created_at',
    order_direction: 'desc',
  });

  const {
    listSubscription,
    data: listSubscriptionData,
    loading: listSubscriptionLoading,
  } = useListSubscriptionApi<ListSubscriptionResponse>();

  const columns: ColumnsType<Subscription> = [
    {
      title: t('common.tenantName'),
      dataIndex: 'tenant_name',
      key: 'tenant_name',
      width: 128,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/tenants/${record.tenant_id}/detail`)}>
          {record.tenant_name || t('common.unknown')}
        </Typography.Link>
      ),
    },
    {
      title: t('subscription.plan'),
      dataIndex: 'subscription_plan_name',
      key: 'subscription_plan_name',
      width: 128,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/subscription-plans/${record.subscription_plan_id}/detail`)}>
          {record.subscription_plan_name || t('common.unknown')}
        </Typography.Link>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 72,
      render: (_: string, record: any) => <DynamicTag value={record.status} type="text" />,
    },
    {
      title: t('subscription.startDate'),
      dataIndex: 'start_date',
      key: 'start_date',
      width: 48,
      render: (_: string, record: any) => formatDateTime(record.start_date, 'date'),
    },
    {
      title: t('subscription.endDate'),
      dataIndex: 'end_date',
      key: 'end_date',
      width: 48,
      render: (_: string, record: any) => formatDateTime(record.end_date, 'date'),
    },
    {
      title: t('subscription.trialEndDate'),
      dataIndex: 'trial_end_date',
      key: 'trial_end_date',
      width: 48,
      render: (_: string, record: any) => formatDateTime(record.trial_end_date, 'date'),
    },
    {
      title: t('subscription.nextRenewalDate'),
      dataIndex: 'next_renewal_date',
      key: 'next_renewal_date',
      width: 48,
      render: (_: string, record: any) => formatDateTime(record.next_renewal_date, 'date'),
    },
    {
      title: t('common.actions'),
      dataIndex: 'actions',
      key: 'actions',
      width: 128,
      render: (_: string, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'detail',
                label: t('common.detail'),
                icon: <EyeOutlined />,
                onClick: () => navigate(`/subscriptions/${record.id}/detail`),
                disabled: !can('subscription.get'),
              },
            ],
          }}
        >
          <Button type="text" icon={<MenuDots weight="Bold" />} />
        </Dropdown>
      ),
    }
  ];

  const handleListSubscription = () => {
    listSubscription(filters);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: search,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    handleListSubscription();
  }, [filters]);

  return (
    <BaseDetailSection
      title={t('subscription.subscriptions')}
      onRefresh={handleListSubscription}
    >
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
      </Flex>

      <Table
        bordered
        dataSource={listSubscriptionData?.data}
        loading={listSubscriptionLoading}
        columns={columns}
        pagination={{
          pageSize: filters.page_size,
          current: filters.page,
          total: listSubscriptionData?.total,
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
          const newFilters: ListSubscriptionRequest = {
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
          overflowX: 'auto',
          backgroundColor: theme.custom.colors.background.light,
          color: theme.custom.colors.neutral.default,
        }}
      />
    </BaseDetailSection>
  );
};
