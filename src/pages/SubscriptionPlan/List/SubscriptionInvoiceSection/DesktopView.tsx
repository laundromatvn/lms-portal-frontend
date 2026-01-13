import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  Dropdown,
  Button,
  Flex,
  Input,
  notification,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import {
  MenuDots,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import {
  useListSubscriptionInvoiceApi,
  type ListSubscriptionInvoiceResponse,
  type ListSubscriptionInvoiceRequest,
} from '@shared/hooks/subscription_plan/useListSubscriptionInvoiceApi';

import { type SubscriptionInvoice } from '@shared/types/subscription/SubscriptionInvoice';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { InvoiceDetailDrawer } from './components/InvoiceDetailDrawer';

import { formatCurrencyCompact } from '@shared/utils/currency';
import { formatDateTime } from '@shared/utils/date';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ListSubscriptionInvoiceRequest>({
    page: 1,
    page_size: 10,
    search: '',
    order_by: 'created_at',
    order_direction: 'desc',
  });

  const [openInvoiceDetailDrawer, setOpenInvoiceDetailDrawer] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SubscriptionInvoice | null>(null);

  const {
    listSubscriptionInvoice,
    data: listSubscriptionInvoiceData,
    loading: listSubscriptionInvoiceLoading,
  } = useListSubscriptionInvoiceApi<ListSubscriptionInvoiceResponse>();

  const columns: ColumnsType<SubscriptionInvoice> = [
    {
      title: t('common.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 128,
      render: (_: string, record: any) => formatDateTime(record.created_at),
    },
    {
      title: t('common.tenantName'),
      dataIndex: 'tenant_name',
      key: 'tenant_name',
      width: 196,
      render: (_: string, record: any) => record.tenant_name ? (
        <Typography.Link onClick={() => navigate(`/tenants/${record.tenant_id}/detail`)}>
          {record.tenant_name}
        </Typography.Link>
      ) : t('common.unknown'),
    },
    {
      title: t('subscription.invoiceCode'),
      dataIndex: 'code',
      key: 'code',
      width: 152,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => {
          setOpenInvoiceDetailDrawer(true);
          setSelectedInvoice(record);
        }}>
          {record.code}
        </Typography.Link>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 128,
      render: (_: string, record: any) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <DynamicTag value={record.status} type="text" />
        </div>
      ),
    },
    {
      title: t('subscription.invoicePeriodStartDate'),
      dataIndex: 'invoice_period_start_date',
      key: 'invoice_period_start_date',
      width: 128,
      render: (_: string, record: any) => formatDateTime(record.invoice_period_start_date, 'date'),
    },
    {
      title: t('subscription.invoicePeriodEndDate'),
      dataIndex: 'invoice_period_end_date',
      key: 'invoice_period_end_date',
      width: 128,
      render: (_: string, record: any) => record.invoice_period_end_date ? formatDateTime(record.invoice_period_end_date, 'date') : t('common.unknown'),
    },
    {
      title: t('subscription.finalAmount'),
      dataIndex: 'final_amount',
      key: 'final_amount',
      width: 128,
      render: (_: string, record: any) => formatCurrencyCompact(record.final_amount),
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
                key: 'confirmPayment',
                label: t('subscription.confirmPayment'),
                icon: <CheckOutlined />,
                onClick: () => {
                  handleConfirmPayment(record);
                },
              },
              {
                key: 'cancelPayment',
                label: t('subscription.rejectPayment'),
                icon: <CloseOutlined />,
                onClick: () => {
                  handleRejectPayment(record);
                },
                style: { color: theme.custom.colors.danger.default },
              },
            ],
          }}
        >
          <Button type="text" icon={<MenuDots weight="Bold" />} />
        </Dropdown>
      ),
    },
  ];

  const handleListSubscriptionInvoice = () => {
    listSubscriptionInvoice(filters);
  };

  const handleConfirmPayment = (invoice: SubscriptionInvoice) => {
    console.log('confirm payment', invoice);
  };

  const handleRejectPayment = (invoice: SubscriptionInvoice) => {
    console.log('reject payment', invoice);
  };

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
    handleListSubscriptionInvoice();
  }, [filters]);

  return (
    <BaseDetailSection
      title={t('subscription.invoices')}
      onRefresh={handleListSubscriptionInvoice}
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
      </Flex>

      <Table
        bordered
        dataSource={listSubscriptionInvoiceData?.data}
        loading={listSubscriptionInvoiceLoading}
        columns={columns}
        pagination={{
          pageSize: filters.page_size,
          current: filters.page,
          total: listSubscriptionInvoiceData?.total,
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
          const newFilters: ListSubscriptionInvoiceRequest = {
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

      {selectedInvoice && openInvoiceDetailDrawer && (
        <InvoiceDetailDrawer
          open={openInvoiceDetailDrawer}
          onClose={() => setOpenInvoiceDetailDrawer(false)}
          invoice={selectedInvoice}
          onConfirmPayment={() => {
            setOpenInvoiceDetailDrawer(false);
            handleConfirmPayment(selectedInvoice);
            setSelectedInvoice(null);
          }}
          onRejectPayment={() => {
            setOpenInvoiceDetailDrawer(false);
            handleRejectPayment(selectedInvoice);
            setSelectedInvoice(null);
          }}
        />
      )}
    </BaseDetailSection>
  );
};
