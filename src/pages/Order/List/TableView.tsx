import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Typography,
  Table,
  Skeleton,
  notification,
  Popconfirm,
} from 'antd';

import {
  BillCheck,
  BillCross,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';

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

import { ChipFilter } from '@pages/OverviewV2/StoreOverview/ChipFilter';
import { MoreFilterDrawer } from './MoreFilterDrawer';

import dayjs from '@shared/utils/dayjs';

export const OrderTableView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();
  const [moreFilterDrawerOpen, setMoreFilterDrawerOpen] = useState(false);

  const tenant = tenantStorage.load();

  const [tableData, setTableData] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState<string>('created_at');
  const [orderDirection, setOrderDirection] = useState<string>('desc');
  const [selectedFilters, setSelectedFilters] = useState<{ label: string; value: any }[]>([
    { label: t('common.all'), value: 'all' },
  ]);
  const appliedFilters = useRef<{
    store_ids: string[];
    start_datetime: string;
    end_datetime: string;
  }>({ store_ids: [], start_datetime: '', end_datetime: '' });
    useEffect(() => {
    appliedFilters.current = {
      store_ids: appliedFilters.current.store_ids,
      start_datetime: appliedFilters.current.start_datetime,
      end_datetime: appliedFilters.current.end_datetime,
    };
  }, [appliedFilters.current]);

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
      title: t('common.storeName'),
      dataIndex: 'store_name',
      key: 'store_name',
      width: 256,
      render: (text: string, record: any) => <Typography.Link onClick={() => navigate(`/stores/${record.store_id}/detail`)}>{text}</Typography.Link>
    },
    {
      title: t('common.transactionCode'),
      dataIndex: 'transaction_code',
      key: 'transaction_code',
      width: 128,
      render: (text: string, record: any) => <Typography.Link onClick={() => navigate(`/orders/${record.id}/detail`)}>{text}</Typography.Link>
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 128,
      sorter: true,
      onSort: (column: string, direction: 'asc' | 'desc') => handleSort(column, direction),
      render: (text: string) => <DynamicTag value={text} />
    },
    {
      title: t('common.totalAmount'),
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 128,
      sorter: true,
      onSort: (column: string, direction: 'asc' | 'desc') => handleSort(column, direction),
      render: (text: string) => formatCurrencyCompact(text)
    },
    {
      title: t('common.totalWasher'),
      dataIndex: 'total_washer',
      key: 'total_washer',
      width: 128,
      sorter: true,
      onSort: (column: string, direction: 'asc' | 'desc') => handleSort(column, direction),
      render: (text: string) => text
    },
    {
      title: t('common.totalDryer'), dataIndex: 'total_dryer',
      key: 'total_dryer',
      width: 128,
      sorter: true,
      onSort: (column: string, direction: 'asc' | 'desc') => handleSort(column, direction),
      render: (text: string) => text
    },
    {
      title: t('common.actions'), dataIndex: 'actions', render: (_: string, record: any) => {
        return (
          <Flex gap={theme.custom.spacing.medium}>
            <Popconfirm
              title={t('common.pay')}
              onConfirm={() => triggerPaymentSuccess(record.id)}
              onCancel={() => triggerPaymentFailed(record.id)}
              okText={t('common.confirm')}
              cancelText={t('common.cancel')}
            >
              <Button
                type="link"
                icon={<BillCheck size={18} />}
                style={{
                  color: theme.custom.colors.success.default,
                }}
              />
            </Popconfirm>

            <Popconfirm
              title={t('common.cancelPayment')}
              onConfirm={() => triggerPaymentFailed(record.id)}
              onCancel={() => triggerPaymentFailed(record.id)}
              okText={t('common.confirm')}
              cancelText={t('common.cancel')}
            >
              <Button
                type="link"
                icon={<BillCross size={18} />}
                style={{
                  color: theme.custom.colors.danger.default,
                }}
              />
            </Popconfirm>
          </Flex>
        );
      }
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
    let start_date: string | undefined;
    let end_date: string | undefined;

    // Use datetime filters from MoreFilterDrawer if provided, otherwise use chip filter dates
    if (appliedFilters.current.start_datetime !== undefined || appliedFilters.current.end_datetime !== undefined) {
      // If custom datetime filters are set, use them (can be undefined if cleared)
      start_date = appliedFilters.current.start_datetime;
      end_date = appliedFilters.current.end_datetime;
    } else {
      // Use chip filter dates
      const today = dayjs();

      if (selectedFilters.find((filter) => filter.value === 'today')) {
        start_date = today.startOf('day').toISOString();
        end_date = today.endOf('day').toISOString();
      } else if (selectedFilters.find((filter) => filter.value === 'yesterday')) {
        start_date = today.subtract(1, 'day').startOf('day').toISOString();
        end_date = today.subtract(1, 'day').endOf('day').toISOString();
      } else if (selectedFilters.find((filter) => filter.value === 'this_week')) {
        start_date = today.startOf('week').toISOString();
        end_date = today.endOf('week').toISOString();
      } else if (selectedFilters.find((filter) => filter.value === 'this_month')) {
        start_date = today.startOf('month').toISOString();
        end_date = today.endOf('month').toISOString();
      } else if (selectedFilters.find((filter) => filter.value === 'all')) {
        start_date = undefined;
        end_date = undefined;
      }
    }

    if (tenant) {
      listOrder({
        page,
        page_size: pageSize,
        tenant_id: tenant.id,
        order_by: orderBy,
        order_direction: orderDirection as 'asc' | 'desc',
        start_date,
        end_date,
        store_ids: appliedFilters.current.store_ids,
      });
    } else {
      listOrder({
        page,
        page_size: pageSize,
        order_by: orderBy,
        order_direction: orderDirection as 'asc' | 'desc',
        start_date,
        end_date,
        store_ids: appliedFilters.current.store_ids,
      });
    }
  }

  const handleFilterChange = async (filters: { label: string; value: any }[]) => {
    setSelectedFilters(filters);
    handleListOrder();
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
  }, [selectedFilters, orderBy, orderDirection, page, pageSize]);

  return (
    <PortalLayoutV2 title={t('common.orderList')} onBack={() => navigate(-1)}>
      {contextHolder}

      <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        <ChipFilter
          options={[
            { label: t('common.today'), value: 'today' },
            { label: t('common.yesterday'), value: 'yesterday' },
            { label: t('common.thisWeek'), value: 'this_week' },
            { label: t('common.thisMonth'), value: 'this_month' },
            { label: t('common.all'), value: 'all' },
          ]}
          values={selectedFilters}
          onChange={handleFilterChange}
          style={{ width: '100%', justifyContent: 'flex-end' }}
          onFilterClick={() => setMoreFilterDrawerOpen(true)}
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
                onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                },
              }}
              style={{ width: '100%' }}
              scroll={{ x: 'max-content' }}
            />
          </Flex>
        )}
      </Box>

      <MoreFilterDrawer
        open={moreFilterDrawerOpen}
        onClose={() => setMoreFilterDrawerOpen(false)}
        initialFilters={appliedFilters.current}
        onApplyFilters={(filters: { store_ids: string[]; start_datetime: string; end_datetime: string }) => {
          appliedFilters.current = {
            store_ids: filters.store_ids,
            start_datetime: filters.start_datetime,
            end_datetime: filters.end_datetime,
          };
          setPage(1);
          handleListOrder();
        }}
      />
    </PortalLayoutV2>
  );
};
