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
import { Box } from '@shared/components/Box';

import { formatCurrencyCompact } from '@shared/utils/currency';
import { formatDateTime } from '@shared/utils/date';

import { ChipFilter } from '@pages/OverviewV2/StoreOverview/ChipFilter';
import { MoreFilterDrawer } from './MoreFilterDrawer';

import dayjs from '@shared/utils/dayjs';

export const OrderListView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();
  const [moreFilterDrawerOpen, setMoreFilterDrawerOpen] = useState(false);

  const tenant = tenantStorage.load();

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
  // Track filter changes to trigger reload
  const [filterKey, setFilterKey] = useState(0);

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
    let start_date: string | undefined;
    let end_date: string | undefined;

    // Use datetime filters from MoreFilterDrawer if provided, otherwise use chip filter dates
    const hasCustomDatetime = (appliedFilters.current.start_datetime && appliedFilters.current.start_datetime !== '') ||
                               (appliedFilters.current.end_datetime && appliedFilters.current.end_datetime !== '');
    
    if (hasCustomDatetime) {
      // If custom datetime filters are set, use them (can be undefined if cleared)
      start_date = appliedFilters.current.start_datetime && appliedFilters.current.start_datetime !== '' 
        ? appliedFilters.current.start_datetime 
        : undefined;
      end_date = appliedFilters.current.end_datetime && appliedFilters.current.end_datetime !== '' 
        ? appliedFilters.current.end_datetime 
        : undefined;
    } else {
      // Use chip filter dates
      const today = dayjs();

      if (selectedFilters.find((filter) => filter.value === 'today')) {
        start_date = today.startOf('day').toISOString();
        end_date = today.endOf('day').toISOString();
      } else if (selectedFilters.find((filter) => filter.value === 'this_week')) {
        start_date = today.startOf('week').toISOString();
        end_date = today.endOf('week').toISOString();
      } else if (selectedFilters.find((filter) => filter.value === 'this_month')) {
        start_date = today.startOf('month').toISOString();
        end_date = today.endOf('month').toISOString();
      } else if (selectedFilters.find((filter) => filter.value === 'this_year')) {
        start_date = today.startOf('year').toISOString();
        end_date = today.endOf('year').toISOString();
      } else if (selectedFilters.find((filter) => filter.value === 'all')) {
        start_date = undefined;
        end_date = undefined;
      }
    }

    const storeIds = appliedFilters.current.store_ids && appliedFilters.current.store_ids.length > 0
      ? appliedFilters.current.store_ids
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
  }, [tenant, page, pageSize, orderBy, orderDirection, selectedFilters, listOrder]);

  const handleFilterChange = async (filters: { label: string; value: any }[]) => {
    setSelectedFilters(filters);
    setPage(1);
  };

  const handleSort = async (column: string, direction: 'asc' | 'desc') => {
    setOrderBy(column);
    setOrderDirection(direction);
    setPage(1);
  };

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
  }, [page, pageSize, orderBy, orderDirection, selectedFilters, filterKey]);

  return (
    <PortalLayoutV2 title={t('common.orderList')} onBack={() => navigate(-1)}>
      {contextHolder}

      <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        <ChipFilter
          options={[
            { label: t('common.today'), value: 'today' },
            { label: t('common.thisWeek'), value: 'this_week' },
            { label: t('common.thisMonth'), value: 'this_month' },
            { label: t('common.thisYear'), value: 'this_year' },
            { label: t('common.all'), value: 'all' },
          ]}
          values={selectedFilters}
          onChange={handleFilterChange}
          style={{ width: '100%', justifyContent: 'flex-end' }}
          onFilterClick={() => setMoreFilterDrawerOpen(true)}
        />

        <List
          dataSource={listOrderData?.data || []}
          loading={listOrderLoading && listOrderData ? listOrderData.data.length > 0 : false}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: listOrderData?.total || 0,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            style: { marginTop: theme.custom.spacing.medium },
          }}
          renderItem={(item) => (
            <List.Item
              style={{
                width: '100%',
                padding: theme.custom.spacing.large,
                marginBottom: theme.custom.spacing.medium,
                backgroundColor: theme.custom.colors.background.light,
                borderRadius: theme.custom.radius.medium,
                border: `1px solid ${theme.custom.colors.neutral[200]}`,
              }}
            >
              <Flex vertical gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                <Flex justify="space-between" align="center" wrap="wrap" gap={theme.custom.spacing.small}>
                  <Typography.Link
                    onClick={() => navigate(`/orders/${item.id}/detail`)}
                    style={{ fontSize: theme.custom.fontSize.large, fontWeight: 500 }}
                  >
                    {item.transaction_code}
                  </Typography.Link>
                  <DynamicTag value={item.status} />
                </Flex>

                <Flex justify="space-between" wrap="wrap" gap={theme.custom.spacing.xsmall}>
                  <Typography.Text type="secondary">
                    {formatDateTime(item.created_at)}
                  </Typography.Text>
                  <Typography.Text strong style={{ color: theme.custom.colors.success.default }}>
                    {formatCurrencyCompact(item.total_amount)}
                  </Typography.Text>
                </Flex>

                <Flex
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography.Text type="secondary">{item.store_name}</Typography.Text>
                </Flex>

                <Flex gap={theme.custom.spacing.medium}>
                  <Typography.Text type="secondary">
                    {t('order.list.totalWasher', { noWashers: item.total_washer || 0 })}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {t('order.list.totalDryer', { noDryers: item.total_dryer || 0 })}
                  </Typography.Text>
                </Flex>

                {item.status === OrderStatusEnum.WAITING_FOR_PAYMENT && (
                  <Flex justify="flex-end" align="center" gap={theme.custom.spacing.small}>
                    <Button
                      type="text"
                      onClick={() => triggerPaymentFailed(item.id)}
                      icon={<CloseCircle size={18} />}
                      style={{
                        color: theme.custom.colors.danger.default,
                        backgroundColor: theme.custom.colors.danger.light,
                        border: 'none',
                      }}
                    >
                      {t('common.cancel')}
                    </Button>

                    <Button
                      type="text"
                      onClick={() => triggerPaymentSuccess(item.id)}
                      icon={<CheckCircle size={18} />}
                      style={{
                        color: theme.custom.colors.success.default,
                        backgroundColor: theme.custom.colors.success.light,
                      }}
                    >
                      {t('common.pay')}
                    </Button>
                  </Flex>
                )}
              </Flex>
            </List.Item>
          )}
        />
      </Box>

      <MoreFilterDrawer
        open={moreFilterDrawerOpen}
        onClose={() => setMoreFilterDrawerOpen(false)}
        initialFilters={appliedFilters.current}
        onApplyFilters={(filters: { store_ids: string[]; start_datetime: string; end_datetime: string }) => {
          appliedFilters.current = {
            store_ids: filters.store_ids || [],
            start_datetime: filters.start_datetime || '',
            end_datetime: filters.end_datetime || '',
          };
          setPage(1);
          setFilterKey((prev) => prev + 1); // Trigger reload by updating filterKey
        }}
      />
    </PortalLayoutV2>
  );
};
