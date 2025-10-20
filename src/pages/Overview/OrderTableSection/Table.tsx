import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Table, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import formatCurrencyCompact from '@shared/utils/currency';

import type { OverviewOrder } from '@shared/types/dashboard/OverviewOrder';
import { DynamicTag } from '@shared/components/DynamicTag';

type Props = {
  orders?: OverviewOrder[];
  loading?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
};

export const OverviewOrderTable: React.FC<Props> = ({ 
  orders, 
  loading = false,
  onSort,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const columns = [
    {
      title: t('overview.orderTable.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 100,
      sorter: true,
      onSort: (column: string, direction: 'asc' | 'desc') => onSort?.(column, direction),
    },
    {
      title: t('overview.orderTable.orderId'),
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left' as const,
      render: (text: string, record: OverviewOrder) => (
        <div style={{
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          lineHeight: '1.4'
        }}>
          <Typography.Link
            onClick={(e) => {
              e.preventDefault();
              navigate(`/orders/${record.id}/detail`);
            }}
          >
            {record.id}
          </Typography.Link>
        </div>
      )
    },
    {
      title: t('overview.orderTable.transactionCode'),
      dataIndex: 'transaction_code',
      key: 'transaction_code',
      width: 100,
    },
    {
      title: t('overview.orderTable.totalAmount'),
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 100,
      render: (text: string) => (
        <Typography.Text style={{ textAlign: 'right', width: '100%' }}>
          {formatCurrencyCompact(text)}
        </Typography.Text>
      )
    },
    {
      title: t('overview.orderTable.totalWasher'),
      dataIndex: 'total_washer',
      key: 'total_washer',
      width: 100,
      render: (text: string) => (
        <Typography.Text style={{ textAlign: 'right', width: '100%' }}>
          {text}
        </Typography.Text>
      )
    },
    {
      title: t('overview.orderTable.totalDryer'),
      dataIndex: 'total_dryer',
      key: 'total_dryer',
      width: 100,
      render: (text: string) => (
        <Typography.Text style={{ textAlign: 'right', width: '100%' }}>
          {text}
        </Typography.Text>
      )
    },
    {
      title: t('overview.orderTable.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text: string) => (
        <DynamicTag value={text} />
      )
    },
    {
      title: t('overview.orderTable.paymentStatus'),
      dataIndex: 'payment_status',
      key: 'payment_status',
      width: 100,
      render: (text: string) => (
        <DynamicTag value={text} />
      )
    },
  ]

  const data = useMemo(() =>
    orders?.map((order) => ({
      id: order.id,
      created_at: order.created_at,
      updated_at: order.updated_at,
      deleted_at: order.deleted_at,
      created_by: order.created_by,
      updated_by: order.updated_by,
      deleted_by: order.deleted_by,
      total_amount: order.total_amount,
      total_washer: order.total_washer,
      total_dryer: order.total_dryer,
      status: order.status,
      payment_status: order.payment_status,
      transaction_code: order.transaction_code,
    })) || [], [orders]);


  return (
    <Table
      dataSource={data}
      columns={columns}
      scroll={{ x: 960 }}
      loading={loading}
      style={{
        width: '100%',
      }}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: orders?.length || 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
        onChange: (page, size) => {
          setCurrentPage(page);
          setPageSize(size || 5);
        },
      }}
      onChange={(pagination, filters, sorter) => {
        if (sorter && !Array.isArray(sorter) && sorter.columnKey) {
          const direction = sorter.order === 'ascend' ? 'asc' : 'desc';
          onSort?.(sorter.columnKey as string, direction);
        }
      }}
      sticky
      bordered
    />
  );
};
