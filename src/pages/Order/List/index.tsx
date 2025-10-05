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

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';

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
    { title: 'Store', dataIndex: 'store_name', width: 300 },
    { title: 'Order ID', dataIndex: 'id', width: 300 },
    { title: 'Status', dataIndex: 'status', width: 200, render: (text: string) => <DynamicTag value={text} /> },
    { title: 'Total Amount', dataIndex: 'total_amount', width: 200 },
    { title: 'Total Washer', dataIndex: 'total_washer', width: 200 },
    { title: 'Total Dryer', dataIndex: 'total_dryer', width: 200 },
    { title: 'Actions', dataIndex: 'actions' },
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
    if (!tenant) return;

    listOrder({ page, page_size: pageSize, tenant_id: tenant.id });
  }

  useEffect(() => {
    if (listOrderData) {
      setTableData(listOrderData?.data.map((item) => ({
        id: item.id,
        status: item.status,
        store_name: item.store_name,
        total_amount: item.total_amount,
        total_washer: item.total_washer,
        total_dryer: item.total_dryer,
        actions: (
          <Flex gap={theme.custom.spacing.medium}>
            <Button
              type="link"
              onClick={() => triggerPaymentSuccess(item.id)}
            >
              <BillCheck size={24} color={theme.custom.colors.success.default} />
            </Button>
            <Button
              type="link"
              onClick={() => triggerPaymentFailed(item.id)}
            >
              <BillCross size={24} color={theme.custom.colors.danger.default} />
            </Button>
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

        <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
          <LeftRightSection
            left={null}
            right={null}
          />

          {listOrderLoading && <Skeleton active />}

          {!listOrderLoading && (
            <Flex vertical gap={theme.custom.spacing.large}>
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
              />
            </Flex>
          )}
        </Flex>
      </Flex>
    </PortalLayout>
  );
};
