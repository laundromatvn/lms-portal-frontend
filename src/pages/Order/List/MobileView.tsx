import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Typography,
  notification,
  List,
} from 'antd';

import {
  CheckCircle,
  CloseCircle,
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
import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { formatCurrencyCompact } from '@shared/utils/currency';
import { formatDateTime } from '@shared/utils/date';

import { ChipFilter, type QuickFilterOption } from '@shared/components/ChipFilterComponent';
import { MoreFilterDrawer } from './components/MoreFilterDrawer';

import dayjs from '@shared/utils/dayjs';

export const MobileView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();
  const [moreFilterDrawerOpen, setMoreFilterDrawerOpen] = useState(false);

  const tenant = tenantStorage.load();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, any>>({
    store_ids: [],
    start_datetime: '',
    end_datetime: '',
  });

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

  const handleListOrder = useCallback(async () => {
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
        order_by: 'created_at',
        order_direction: 'desc',
        start_date,
        end_date,
        store_ids: storeIds,
      });
    } else {
      listOrder({
        page,
        page_size: pageSize,
        order_by: 'created_at',
        order_direction: 'desc',
        start_date,
        end_date,
        store_ids: storeIds,
      });
    }
  }, [tenant, page, pageSize, filters, listOrder]);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPage(1);
  };

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
      setPage(1);
    }
  }, [triggerPaymentSuccessData]);

  useEffect(() => {
    if (triggerPaymentFailedData) {
      api.success({
        message: t('messages.triggerPaymentFailedSuccess'),
      });
      setPage(1);
    }
  }, [triggerPaymentFailedData]);

  useEffect(() => {
    handleListOrder();
  }, [page, pageSize, filters]);

  return (
    <PortalLayoutV2 title={t('common.orderList')} onBack={() => navigate(-1)}>
      {contextHolder}

      <BaseDetailSection>
        <ChipFilter
          quickFilterOptions={quickFilterOptions}
          values={filters}
          onFilterChange={handleFilterChange}
          onFilterClick={() => setMoreFilterDrawerOpen(true)}
          style={{ width: '100%', justifyContent: 'flex-end' }}
        />

        <List
          dataSource={listOrderData?.data || []}
          loading={listOrderLoading && listOrderData ? listOrderData.data.length > 0 : false}
          style={{ width: '100%' }}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: listOrderData?.total || 0,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            style: { color: theme.custom.colors.text.tertiary },
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
          renderItem={(item) => (
            <List.Item
              onClick={() => navigate(`/orders/${item.id}/detail`)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: theme.custom.spacing.small,
                width: '100%',
                padding: theme.custom.spacing.medium,
                marginBottom: theme.custom.spacing.medium,
                backgroundColor: theme.custom.colors.background.light,
                borderRadius: theme.custom.radius.medium,
                border: `1px solid ${theme.custom.colors.neutral[200]}`,
              }}
            >
              <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                <Flex gap={theme.custom.spacing.xxsmall}>
                  <Typography.Text>{item.transaction_code}</Typography.Text>
                  <Typography.Text>•</Typography.Text>
                  <DynamicTag value={item.status} type="text" />
                </Flex>

                <Typography.Text strong style={{ color: theme.custom.colors.success.default }}>
                  {formatCurrencyCompact(item.total_amount)}
                </Typography.Text>
              </Flex>

              <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
                  {formatDateTime(item.created_at)}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
                  {t('order.list.totalWasher', { noWashers: item.total_washer || 0 })}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
                  {t('order.list.totalDryer', { noDryers: item.total_dryer || 0 })}
                </Typography.Text>
              </Flex>

              <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
                {item.store_name}
              </Typography.Text>

              {item.status === OrderStatusEnum.WAITING_FOR_PAYMENT && (
                <Flex justify="space-between" align="center" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                  <Button
                    type="text"
                    size="large"
                    onClick={() => triggerPaymentFailed(item.id)}
                    icon={<CloseCircle size={18} />}
                    style={{
                      width: '100%',
                      color: theme.custom.colors.danger.default,
                      backgroundColor: theme.custom.colors.danger.light,
                      border: 'none',
                      fontWeight: theme.custom.fontWeight.large,
                    }}
                  >
                    {t('common.cancel')}
                  </Button>

                  <Button
                    type="text"
                    size="large"
                    onClick={() => triggerPaymentSuccess(item.id)}
                    icon={<CheckCircle size={18} />}
                    style={{
                      width: '100%',
                      color: theme.custom.colors.success.default,
                      backgroundColor: theme.custom.colors.success.light,
                      fontWeight: theme.custom.fontWeight.large,
                    }}
                  >
                    {t('common.pay')}
                  </Button>
                </Flex>
              )}
            </List.Item>
          )}
        />
      </BaseDetailSection>

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
