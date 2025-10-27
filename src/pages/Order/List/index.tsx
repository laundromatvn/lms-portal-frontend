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
  Popconfirm,
  Input,
  Select,
} from 'antd';

import {
  BillCheck,
  BillCross,
  Refresh,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';

import { useIsMobile } from '@shared/hooks/useIsMobile';
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

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Box } from '@shared/components/Box';

import { formatDateTime } from '@shared/utils/date';
import { formatCurrencyCompact } from '@shared/utils/currency';

import { OrderStatusEnum } from '@shared/enums/OrderStatusEnum';
import { PaymentStatusEnum } from '@shared/enums/PaymentStatusEnum';

export const OrderListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [api, contextHolder] = notification.useNotification();

  const tenant = tenantStorage.load();

  const [tableData, setTableData] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | undefined>();
  const [orderBy, setOrderBy] = useState<string>('created_at');
  const [orderDirection, setOrderDirection] = useState<string>('desc');

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
    if (tenant) {
      listOrder({
        page,
        page_size: pageSize,
        tenant_id: tenant.id,
        status: statusFilter as OrderStatusEnum,
        payment_status: paymentStatusFilter as PaymentStatusEnum,
        query: searchText,
        order_by: orderBy,
        order_direction: orderDirection as 'asc' | 'desc',
      });
    } else {
      listOrder({
        page,
        page_size: pageSize,
        status: statusFilter as OrderStatusEnum,
        payment_status: paymentStatusFilter as PaymentStatusEnum,
        query: searchText,
        order_by: orderBy,
        order_direction: orderDirection as 'asc' | 'desc',
      });
    }
  }

  const handleSearch = async (searchValue: string) => {
    setSearchText(searchValue);
  };

  const handleClear = async () => {
    setSearchText('');
    setSearchError(undefined);
    setStatusFilter(undefined);
    setPaymentStatusFilter(undefined);
  };

  const handleStatusFilter = async (status: OrderStatusEnum) => {
    setStatusFilter(status);
  };

  const handlePaymentStatusFilter = async (paymentStatus: PaymentStatusEnum) => {
    setPaymentStatusFilter(paymentStatus);
  };

  const handleSort = async (column: string, direction: 'asc' | 'desc') => {
    setOrderBy(column);
    setOrderDirection(direction);
  };

  useEffect(() => {
    if (listOrderData) {
      setTableData(listOrderData?.data.map((item) => ({
        id: item.id,
        created_at: item.created_at,
        store_name: item.store_name,
        transaction_code: item.transaction_code,
        status: item.status,
        total_amount: item.total_amount,
        total_washer: item.total_washer,
        total_dryer: item.total_dryer,
      })));
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
  }, [page, pageSize, statusFilter, paymentStatusFilter, searchText, orderBy, orderDirection]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('common.orderList')}</Typography.Title>

        <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <LeftRightSection
            left={(
              <Input.Search
                placeholder={t('overview.orderTable.searchPlaceholder')}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                onSearch={handleSearch}
                allowClear
                onClear={handleClear}
                status={searchError ? 'error' : undefined}
                style={{ width: 200, marginBottom: theme.custom.spacing.small }}
              />)}
            right={(
              <Flex vertical={isMobile} gap={theme.custom.spacing.small}>
                <Button
                  type="text"
                  icon={<Refresh />}
                  onClick={handleListOrder}
                />

                <Select
                  placeholder={t('overview.orderTable.status')}
                  style={{ width: 150 }}
                  allowClear
                  value={statusFilter}
                  onChange={(value) => handleStatusFilter(value as OrderStatusEnum)}
                >
                  {Object.values(OrderStatusEnum).map((status) => (
                    <Select.Option key={status} value={status} style={{ textAlign: 'left' }}>
                      <DynamicTag value={status} />
                    </Select.Option>
                  ))}
                </Select>

                <Select
                  placeholder={t('overview.orderTable.paymentStatus')}
                  style={{ width: 180 }}
                  allowClear
                  value={paymentStatusFilter}
                  onChange={(value) => handlePaymentStatusFilter(value as PaymentStatusEnum)}
                >
                  {Object.values(PaymentStatusEnum).map((status) => (
                    <Select.Option key={status} value={status} style={{ textAlign: 'left' }}>
                      <DynamicTag value={status} />
                    </Select.Option>
                  ))}
                </Select>
              </Flex>
            )}
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
      </Flex>
    </PortalLayout>
  );
};
