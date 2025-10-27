import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, Input, Flex, Select, Button } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';
import { useListOverviewOrderApi } from '@shared/hooks/dashboard/useListOverviewOrderApi';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { Box } from '@shared/components/Box';
import { OverviewOrderTable } from './Table';
import LeftRightSection from '@shared/components/LeftRightSection';

import type { OverviewOrder } from '@shared/types/dashboard/OverviewOrder';
import { OrderStatusEnum } from '@shared/enums/OrderStatusEnum';
import { PaymentStatusEnum } from '@shared/enums/PaymentStatusEnum';
import { Refresh } from '@solar-icons/react';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  style?: React.CSSProperties;
}

export const OverviewOrderTableSection: React.FC<Props> = ({ style }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();
  const tenant = tenantStorage.load();

  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | undefined>();
  const [orderBy, setOrderBy] = useState<string | undefined>();
  const [orderDirection, setOrderDirection] = useState<string | undefined>();

  const [orders, setOrders] = useState<OverviewOrder[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const {
    listOverviewOrder,
    data: listOverviewOrderData,
    loading: listOverviewOrderLoading,
  } = useListOverviewOrderApi();

  const validateSearchText = (text: string): boolean => {
    if (!text) return true;

    return text.length > 2;
  };

  const handleListOverviewOrder = async () => {
    setIsTableLoading(true);
    try {
      await listOverviewOrder({
        tenant_id: tenant?.id as string,
        status: statusFilter as OrderStatusEnum,
        payment_status: paymentStatusFilter as PaymentStatusEnum,
        query: searchText,
        order_by: orderBy,
        order_direction: orderDirection as 'asc' | 'desc'
      });
    } finally {
      setIsTableLoading(false);
    }
  };

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
    if (listOverviewOrderData?.data) {
      setOrders(listOverviewOrderData.data as OverviewOrder[]);
    }
  }, [listOverviewOrderData]);

  // Initial load
  useEffect(() => {
    handleListOverviewOrder();
  }, []);

  useEffect(() => {
    if (!validateSearchText(searchText)) return;

    handleListOverviewOrder();
  }, [searchText, statusFilter, paymentStatusFilter, orderBy, orderDirection]);


  return (
    <Box
      vertical
      gap={theme.custom.spacing.medium}
      style={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'auto',
        ...style,
      }}
    >
      <Typography.Title level={3}>
        {t('overview.orderTable.title')}
      </Typography.Title>

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
              icon={<Refresh />}
              onClick={handleListOverviewOrder}
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

      <OverviewOrderTable
        orders={orders}
        loading={isTableLoading}
        onSort={(column, direction) => handleSort(column, direction)}
      />
    </Box>
  );
};
