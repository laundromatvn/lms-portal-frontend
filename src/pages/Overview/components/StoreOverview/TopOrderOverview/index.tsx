import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Flex,
  Button,
  List,
  Typography,
} from 'antd';

import {
  CloseCircle,
  CheckCircle,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { OrderStatusEnum } from '@shared/enums/OrderStatusEnum';

import type { Store } from '@shared/types/store';

import { useListOverviewOrderApi } from '@shared/hooks/dashboard/useListOverviewOrderApi';
import { useTriggerPaymentFailedApi } from '@shared/hooks/useTriggerPaymentFailedApi';
import { useTriggerPaymentSuccessApi } from '@shared/hooks/useTriggerPaymentSuccessApi';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatCurrencyCompact } from '@shared/utils/currency';
import { formatDateTime } from '@shared/utils/date';


interface Props {
  store: Store;
  filters: Record<string, any>;
  datetimeFilters?: {
    start_datetime: string;
    end_datetime: string;
  };
}

export const TopOrderOverview: React.FC<Props> = ({ store, filters, datetimeFilters }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    listOverviewOrder,
    data: listOverviewOrderData,
    loading: listOverviewOrderLoading,
  } = useListOverviewOrderApi();
  const {
    triggerPaymentFailed,
  } = useTriggerPaymentFailedApi();
  const {
    triggerPaymentSuccess,
  } = useTriggerPaymentSuccessApi();

  const handleListOverviewOrder = async () => {
    const queryParams = {
      store_id: store.id,
      page: 1,
      page_size: 5,
    } as Record<string, any>;

    // Use datetime filters from MoreFilterDrawer if provided, otherwise use chip filter dates
    const hasCustomDatetime = (datetimeFilters?.start_datetime && datetimeFilters.start_datetime !== '') ||
      (datetimeFilters?.end_datetime && datetimeFilters.end_datetime !== '');

    if (hasCustomDatetime) {
      // If custom datetime filters are set, use them (can be undefined if cleared)
      queryParams.start_date = datetimeFilters?.start_datetime && datetimeFilters.start_datetime !== ''
        ? datetimeFilters.start_datetime
        : undefined;
      queryParams.end_date = datetimeFilters?.end_datetime && datetimeFilters.end_datetime !== ''
        ? datetimeFilters.end_datetime
        : undefined;
    } else {
      // Use chip filter dates
      if (filters.start_datetime && filters.start_datetime !== '') {
        queryParams.start_date = filters.start_datetime;
      }
      if (filters.end_datetime && filters.end_datetime !== '') {
        queryParams.end_date = filters.end_datetime;
      }
    }

    await listOverviewOrder(queryParams);
  };

  useEffect(() => {
    handleListOverviewOrder();
  }, [filters, datetimeFilters]);

  return (
    <BaseDetailSection
      title={t('overviewV2.topOrderOverview', { topOrders: 5 })}
      onRefresh={handleListOverviewOrder}
    >
      <List
        dataSource={listOverviewOrderData?.data || []}
        loading={listOverviewOrderLoading}
        style={{ width: '100%' }}
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

            <Flex align="center" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
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

      <Flex justify="end" align="center" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Button
          type="link"
          onClick={() => navigate(`/orders?store_id=${store.id}`)}
        >
          {t('common.loadMore')}
        </Button>
      </Flex>
    </BaseDetailSection>
  );
};
