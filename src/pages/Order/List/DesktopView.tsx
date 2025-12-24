import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Typography,
  Table,
  Skeleton,
  notification,
  Dropdown,
  type MenuProps,
} from 'antd';

import {
  BillCheck,
  BillCross,
  MenuDots
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';

import { OrderStatusEnum } from '@shared/enums/OrderStatusEnum';

import {
  useListOrderApi,
  type ListOrderResponse,
} from '@shared/hooks/useListOrderApi';
import {
  useTriggerPaymentSuccessApi,
  type TriggerPaymentSuccessResponse,
} from '@shared/hooks/useTriggerPaymentSuccessApi';
import {
  useTriggerPaymentFailedApi,
  type TriggerPaymentFailedResponse,
} from '@shared/hooks/useTriggerPaymentFailedApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Box } from '@shared/components/Box';

import { formatDateTime } from '@shared/utils/date';
import { formatCurrencyCompact } from '@shared/utils/currency';

import { ChipFilter, type QuickFilterOption } from '@shared/components/ChipFilterComponent';
import { MoreFilterDrawer } from './components/MoreFilterDrawer';

import dayjs from '@shared/utils/dayjs';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();
  const [moreFilterDrawerOpen, setMoreFilterDrawerOpen] = useState(false);

  const tenant = tenantStorage.load();

  const [tableData, setTableData] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [orderBy, setOrderBy] = useState<string>('created_at');
  const [orderDirection, setOrderDirection] = useState<string>('desc');
  const [filters, setFilters] = useState<Record<string, any>>({
    store_ids: [],
    start_datetime: '',
    end_datetime: '',
  });

  const quickFilterOptions: QuickFilterOption[] = [
    {
      label: t('common.today'),
      value: 'today',
      filter: {
        start_datetime: dayjs().startOf('day').toISOString(),
        end_datetime: dayjs().endOf('day').toISOString(),
      },
    },
    {
      label: t('common.yesterday'),
      value: 'yesterday',
      filter: {
        start_datetime: dayjs().subtract(1, 'day').startOf('day').toISOString(),
        end_datetime: dayjs().subtract(1, 'day').endOf('day').toISOString(),
      },
    },
    {
      label: t('common.thisWeek'),
      value: 'this_week',
      filter: {
        start_datetime: dayjs().startOf('week').toISOString(),
        end_datetime: dayjs().endOf('week').toISOString(),
      },
    },
    {
      label: t('common.thisMonth'),
      value: 'this_month',
      filter: {
        start_datetime: dayjs().startOf('month').toISOString(),
        end_datetime: dayjs().endOf('month').toISOString(),
      },
    },
    {
      label: t('common.all'),
      value: 'all',
      filter: {},
    },
  ];

  const columns = [
    {
      title: t('common.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 128,
      sorter: true,
      onSort: (column: string, direction: 'asc' | 'desc') => handleSort(column, direction),
      render: (_: string, record: any) => formatDateTime(record.created_at)
    },
    {
      title: t('common.transactionCode'),
      dataIndex: 'transaction_code',
      key: 'transaction_code',
      width: 128,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/orders/${record.id}/detail`)}>
          {record.transaction_code || t('common.unknown')}
        </Typography.Link>
      ),
    },
    {
      title: t('common.storeName'),
      dataIndex: 'store_name',
      key: 'store_name',
      width: 192,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/stores/${record.store_id}/detail`)}>
          {record.store_name || t('common.unknown')}
        </Typography.Link>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 128,
      sorter: true,
      onSort: (column: string, direction: 'asc' | 'desc') => handleSort(column, direction),
      render: (_: string, record: any) => <DynamicTag value={record.status} type="text" />
    },
    {
      title: t('common.totalAmount'),
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 128,
      sorter: true,
      onSort: (column: string, direction: 'asc' | 'desc') => handleSort(column, direction),
      render: (_: string, record: any) => formatCurrencyCompact(record.total_amount)
    },
    {
      title: t('common.totalWasher'),
      dataIndex: 'total_washer',
      key: 'total_washer',
      width: 32,
      sorter: true,
      onSort: (column: string, direction: 'asc' | 'desc') => handleSort(column, direction),
      render: (_: string, record: any) => record.total_washer
    },
    {
      title: t('common.totalDryer'),
      dataIndex: 'total_dryer',
      key: 'total_dryer',
      width: 32,
      sorter: true,
      onSort: (column: string, direction: 'asc' | 'desc') => handleSort(column, direction),
      render: (_: string, record: any) => record.total_dryer
    },
    {
      title: t('common.actions'),
      dataIndex: 'actions',
      key: 'actions',
      width: 32,
      render: (_: string, record: any) => {
        const items: MenuProps['items'] = [
          {
            key: 'pay',
            label: t('common.pay'),
            onClick: () => triggerPaymentSuccess(record.id),
            icon: <BillCheck />,
            style: {
              color: theme.custom.colors.success.default,
            },
          },
          {
            key: 'cancel',
            label: t('common.cancel'),
            onClick: () => triggerPaymentFailed(record.id),
            icon: <BillCross />,
            style: {
              color: theme.custom.colors.danger.default,
            },
          }
        ];

        return (
          <Dropdown
            menu={{ items }}
            trigger={['click']}
          >
            <Button
              type="link"
              icon={<MenuDots weight="Bold" />}
              disabled={![
                OrderStatusEnum.NEW,
                OrderStatusEnum.WAITING_FOR_PAYMENT
              ].includes(record.status as any)}
            />
          </Dropdown>
        );
      },
    },
  ];

  const {
    data: listOrderData,
    loading: listOrderLoading,
    error: listOrderError,
    listOrder,
  } = useListOrderApi<ListOrderResponse>();
  const {
    data: triggerPaymentSuccessData,
    error: triggerPaymentSuccessError,
    triggerPaymentSuccess,
  } = useTriggerPaymentSuccessApi<TriggerPaymentSuccessResponse>();
  const {
    data: triggerPaymentFailedData,
    error: triggerPaymentFailedError,
    triggerPaymentFailed,
  } = useTriggerPaymentFailedApi<TriggerPaymentFailedResponse>();

  const handleListOrder = async () => {
    const start_date = filters.start_datetime && filters.start_datetime !== ''
      ? filters.start_datetime
      : undefined;
    const end_date = filters.end_datetime && filters.end_datetime !== ''
      ? filters.end_datetime
      : undefined;
    const storeIds = filters.store_ids && filters.store_ids.length > 0
      ? filters.store_ids
      : undefined;

    if (tenant) {
      listOrder({
        page,
        page_size: pageSize,
        tenant_id: tenant.id,
        order_by: orderBy,
        order_direction: orderDirection as 'asc' | 'desc',
        start_date,
        end_date,
        store_ids: storeIds,
      });
    } else {
      listOrder({
        page,
        page_size: pageSize,
        order_by: orderBy,
        order_direction: orderDirection as 'asc' | 'desc',
        start_date,
        end_date,
        store_ids: storeIds,
      });
    }
  }

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSort = async (column: string, direction: 'asc' | 'desc') => {
    setOrderBy(column);
    setOrderDirection(direction);
  };

  useEffect(() => {
    if (listOrderData) {
      setTableData(listOrderData?.data as any[]);
    }
  }, [listOrderData]);

  useEffect(() => {
    if (listOrderError) {
      api.error({
        message: t('machine.listMachineError'),
      });
    }
  }, [listOrderError]);

  useEffect(() => {
    if (triggerPaymentSuccessError) {
      api.error({
        message: t('messages.triggerPaymentSuccessError'),
      });
    }
  }, [triggerPaymentSuccessError]);

  useEffect(() => {
    if (triggerPaymentFailedError) {
      api.error({
        message: t('messages.triggerPaymentFailedError'),
      });
    }
  }, [triggerPaymentFailedError]);

  useEffect(() => {
    if (triggerPaymentSuccessData) {
      api.success({
        message: t('messages.triggerPaymentSuccessSuccess'),
      });
    }

    handleListOrder();
  }, [triggerPaymentSuccessData]);

  useEffect(() => {
    if (triggerPaymentFailedData) {
      api.success({
        message: t('messages.triggerPaymentFailedSuccess'),
      });
    }

    handleListOrder();
  }, [triggerPaymentFailedData]);

  useEffect(() => {
    handleListOrder();
  }, [filters, orderBy, orderDirection, page, pageSize]);

  return (
    <PortalLayoutV2 title={t('common.orderList')} onBack={() => navigate(-1)}>
      {contextHolder}

      <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        <ChipFilter
          quickFilterOptions={quickFilterOptions}
          values={filters}
          onFilterChange={handleFilterChange}
          onFilterClick={() => setMoreFilterDrawerOpen(true)}
          style={{ width: '100%', justifyContent: 'flex-end' }}
        />

        {listOrderLoading && <Skeleton active />}

        {!listOrderLoading && (
          <Flex vertical gap={theme.custom.spacing.large} style={{ width: '100%' }}>
            <Table
              bordered
              dataSource={tableData || []}
              columns={columns}
              pagination={{
                pageSize,
                current: page,
                total: listOrderData?.total,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                style: { color: theme.custom.colors.text.tertiary },
                onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                },
              }}
              onChange={(pagination, _filters, sorter) => {
                if (sorter && !Array.isArray(sorter)) {
                  const field = ('field' in sorter && sorter.field) || ('columnKey' in sorter && sorter.columnKey);
                  if (field && sorter.order) {
                    setOrderBy(field as string);
                    setOrderDirection(sorter.order === 'ascend' ? 'asc' : 'desc');
                  } else if (sorter.order === null || sorter.order === undefined) {
                    setOrderBy('');
                    setOrderDirection('asc');
                  }
                }

                setPage(pagination.current || 1);
                setPageSize(pagination.pageSize || 6);
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
              scroll={{ x: 'max-content' }}
            />
          </Flex>
        )}
      </Box>

      <MoreFilterDrawer
        open={moreFilterDrawerOpen}
        onClose={() => setMoreFilterDrawerOpen(false)}
        initialFilters={{
          store_ids: filters.store_ids || [],
          start_datetime: filters.start_datetime || '',
          end_datetime: filters.end_datetime || '',
        }}
        onApplyFilters={(newFilters: { store_ids: string[]; start_datetime: string; end_datetime: string }) => {
          handleFilterChange({
            ...filters,
            store_ids: newFilters.store_ids || [],
            start_datetime: newFilters.start_datetime || '',
            end_datetime: newFilters.end_datetime || '',
          });
        }}
      />
    </PortalLayoutV2>
  );
};
