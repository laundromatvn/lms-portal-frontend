import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  Dropdown,
  Button,
  Flex,
  Input,
  Switch,
  Typography,
  notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import {
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  MenuDots,
  TrashBinTrash,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import {
  useListSubscriptionPlanApi,
  type ListSubscriptionPlanResponse,
  type ListSubscriptionPlanRequest,
} from '@shared/hooks/subscription_plan/useListSubscriptionPlanApi';
import {
  useDeleteSubscriptionPlanApi,
  type DeleteSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useDeleteSubscriptionPlanApi';
import {
  useSetDefaultSubscriptionPlanApi,
  type SetDefaultSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useSetDefaultSubscriptionPlanApi';
import {
  useUpdateSubscriptionPlanApi,
  type UpdateSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useUpdateSubscriptionPlanApi';

import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { formatCurrencyCompact } from '@shared/utils/currency';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ListSubscriptionPlanRequest>({
    page: 1,
    page_size: 10,
    search: '',
    order_by: 'name',
    order_direction: 'desc',
  });

  const {
    listSubscriptionPlan,
    data: listSubscriptionPlanData,
    loading: listSubscriptionPlanLoading,
  } = useListSubscriptionPlanApi<ListSubscriptionPlanResponse>();
  const {
    deleteSubscriptionPlan,
    data: deleteSubscriptionPlanData,
    error: deleteSubscriptionPlanError,
  } = useDeleteSubscriptionPlanApi<DeleteSubscriptionPlanResponse>();
  const {
    setDefaultSubscriptionPlan,
    data: setDefaultSubscriptionPlanData,
    error: setDefaultSubscriptionPlanError,
  } = useSetDefaultSubscriptionPlanApi<SetDefaultSubscriptionPlanResponse>();
  const {
    updateSubscriptionPlan,
    data: updateSubscriptionPlanData,
    error: updateSubscriptionPlanError,
  } = useUpdateSubscriptionPlanApi<UpdateSubscriptionPlanResponse>();

  const columns: ColumnsType<SubscriptionPlan> = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      width: 256,
      sorter: true,
      sortOrder: filters.order_by === 'name' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/subscription-plans/${record.id}/detail`)}>
          {record.name}
        </Typography.Link>
      ),
    },
    {
      title: t('subscription.isEnabled'),
      dataIndex: 'is_enabled',
      key: 'is_enabled',
      width: 128,
      render: (_: string, record: any) => (
        <Switch
          checked={record.is_enabled}
          onChange={() => updateSubscriptionPlan(record.id, { is_enabled: !record.is_enabled })}
        />
      ),
    },
    {
      title: t('subscription.isDefault'),
      dataIndex: 'is_default',
      key: 'is_default',
      width: 128,
      render: (_: string, record: any) => (
        <Switch
          checked={record.is_default}
          onChange={() => setDefaultSubscriptionPlan(record.id)}
        />
      ),
    },
    {
      title: t('subscription.type'),
      dataIndex: 'type',
      key: 'type',
      width: 128,
      sorter: true,
      sortOrder: filters.order_by === 'type' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Text>{t(`subscription.${record.type.toLowerCase()}`)}</Typography.Text>
      )
    },
    {
      title: t('subscription.intervalCount'),
      dataIndex: 'interval_count',
      key: 'interval_count',
      width: 128,
      sorter: true,
      sortOrder: filters.order_by === 'interval_count' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('subscription.interval'),
      dataIndex: 'interval',
      key: 'interval',
      width: 128,
      sorter: true,
      sortOrder: filters.order_by === 'interval' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Text>{t(`subscription.${record.interval.toLowerCase()}`)}</Typography.Text>
      ),
    },
    {
      title: t('common.price'),
      dataIndex: 'price',
      key: 'price',
      width: 128,
      sorter: true,
      sortOrder: filters.order_by === 'price' ? (filters.order_direction === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Text>
          {formatCurrencyCompact(record.price)}
        </Typography.Text>
      ),
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
                icon: <TrashBinTrash />,
                onClick: () => deleteSubscriptionPlan(record.id),
                disabled: !can('subscription_plan.delete'),
                style: {
                  color: theme.custom.colors.danger.default,
                },
              },
            ],
          }}
        >
          <Button type="text" icon={<MenuDots weight="Bold" />} />
        </Dropdown>
      ),
    },
  ];

  const handleListSubscriptionPlan = () => {
    listSubscriptionPlan(filters);
  };

  useEffect(() => {
    if (updateSubscriptionPlanError) {
      api.error({
        message: t('subscription.messages.updateSubscriptionPlanError'),
      });
    }
  }, [updateSubscriptionPlanError]);

  useEffect(() => {
    if (updateSubscriptionPlanData) {
      api.success({
        message: t('subscription.messages.updateSubscriptionPlanSuccess'),
      });

      handleListSubscriptionPlan();
    }
  }, [updateSubscriptionPlanData]);

  useEffect(() => {
    if (setDefaultSubscriptionPlanError) {
      api.error({
        message: t('subscription.messages.setDefaultSubscriptionPlanError'),
      });
    }
  }, [setDefaultSubscriptionPlanError]);

  useEffect(() => {
    if (setDefaultSubscriptionPlanData) {
      api.success({
        message: t('subscription.messages.setDefaultSubscriptionPlanSuccess'),
      });

      handleListSubscriptionPlan();
    }
  }, [setDefaultSubscriptionPlanData]);

  useEffect(() => {
    if (deleteSubscriptionPlanError) {
      api.error({
        message: t('subscription.messages.deleteSubscriptionPlanError'),
      });
    }
  }, [deleteSubscriptionPlanError]);

  useEffect(() => {
    if (deleteSubscriptionPlanData) {
      api.success({
        message: t('subscription.messages.deleteSubscriptionPlanSuccess'),
      });

      handleListSubscriptionPlan();
    }
  }, [deleteSubscriptionPlanData]);

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
    handleListSubscriptionPlan();
  }, [filters]);

  return (
    <BaseDetailSection
      title={t('subscription.plans')}
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

        <Button
          icon={<PlusOutlined />}
          onClick={() => navigate('/subscription-plans/add')}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        >
          {t('common.add')}
        </Button>
      </Flex>

      <Table
        bordered
        dataSource={listSubscriptionPlanData?.data}
        loading={listSubscriptionPlanLoading}
        columns={columns}
        pagination={{
          pageSize: filters.page_size,
          current: filters.page,
          total: listSubscriptionPlanData?.total,
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
          const newFilters: ListSubscriptionPlanRequest = {
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
