import React, { use, useEffect, useState } from 'react';
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
  Eye,
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

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Box } from '@shared/components/Box';

import { formatDateTime } from '@shared/utils/date';
import { formatCurrencyCompact } from '@shared/utils/currency';

export const OrderListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const tenant = tenantStorage.load();

  const [tableData, setTableData] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { title: t('common.createdAt'), dataIndex: 'created_at', width: 72 },
    { title: t('common.storeName'), dataIndex: 'store_name', width: 256 },
    { title: t('common.transactionCode'), dataIndex: 'transaction_code', width: 128 },
    { title: t('common.status'), dataIndex: 'status', width: 128, render: (text: string) => <DynamicTag value={text} /> },
    { title: t('common.totalAmount'), dataIndex: 'total_amount', width: 128 },
    { title: t('common.totalWasher'), dataIndex: 'total_washer', width: 128 },
    { title: t('common.totalDryer'), dataIndex: 'total_dryer', width: 128 },
    { title: t('common.actions'), dataIndex: 'actions' },
  ];

  const {
    data: listOrderData,
    loading: listOrderLoading,
    error: listOrderError,
    listOrder,
  } = useListOrderApi<ListOrderResponse>();
  const {
    data: triggerPaymentSuccessData,
    loading: triggerPaymentSuccessLoading,
    error: triggerPaymentSuccessError,
    triggerPaymentSuccess,
  } = useTriggerPaymentSuccessApi<TriggerPaymentSuccessResponse>();
  const {
    data: triggerPaymentFailedData,
    loading: triggerPaymentFailedLoading,
    error: triggerPaymentFailedError,
    triggerPaymentFailed,
  } = useTriggerPaymentFailedApi<TriggerPaymentFailedResponse>();

  const handleListOrder = async () => {
    if (tenant) {
      listOrder({ page, page_size: pageSize, tenant_id: tenant.id });
    } else {
      listOrder({ page, page_size: pageSize });
    }
  }

  useEffect(() => {
    if (listOrderData) {
      setTableData(listOrderData?.data.map((item) => ({
        id: <Typography.Link onClick={() => navigate(`/orders/${item.id}/detail`)}>{item.id}</Typography.Link>,
        created_at: formatDateTime(item.created_at),
        transaction_code: <Typography.Link onClick={() => navigate(`/orders/${item.id}/detail`)}>{item.transaction_code}</Typography.Link>,
        status: item.status,
        store_name: <Typography.Link onClick={() => navigate(`/stores/${item.store_id}/detail`)}>{item.store_name}</Typography.Link>,
        total_amount: formatCurrencyCompact(item.total_amount),
        total_washer: item.total_washer,
        total_dryer: item.total_dryer,
        actions: (
          <Flex gap={theme.custom.spacing.medium}>
            <Popconfirm
              title={t('common.pay')}
              onConfirm={() => triggerPaymentSuccess(item.id)}
              onCancel={() => triggerPaymentFailed(item.id)}
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
              onConfirm={() => triggerPaymentFailed(item.id)}
              onCancel={() => triggerPaymentFailed(item.id)}
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
        ),
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
  }, [page, pageSize]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical style={{ height: '100%' }}>
        <Typography.Title level={2}>Order List</Typography.Title>

        <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <LeftRightSection
            left={null}
            right={null}
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
