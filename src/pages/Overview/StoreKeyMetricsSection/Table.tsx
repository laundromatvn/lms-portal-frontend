import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Table, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import formatCurrencyCompact from '@shared/utils/currency';

import type { OverviewStoreKeyMetrics } from '@shared/types/dashboard/OverviewStoreKeyMetrics';

type Props = {
  storeKeyMetrics?: OverviewStoreKeyMetrics[];
};

export const StoreKeyMetricsTable: React.FC<Props> = ({ storeKeyMetrics }) => {
  const { t } = useTranslation();

  const theme = useTheme();

  const navigate = useNavigate();

  const columns = [
    { 
      title: t('overview.storeKeyMetrics.name'), 
      dataIndex: 'name', 
      width: 200,
      fixed: 'left' as const,
      render: (text: string, record: OverviewStoreKeyMetrics) => (
        <div style={{ 
          wordWrap: 'break-word', 
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          lineHeight: '1.4'
        }}>
          <Typography.Link 
            onClick={(e) => {
              e.preventDefault();
              navigate(`/stores/${record.id}/detail`);
            }}
          >
            {record.name}
          </Typography.Link>
        </div>
      )
    },
    { 
      title: t('overview.storeKeyMetrics.address'), 
      dataIndex: 'address', 
      width: 250,
      render: (text: string) => (
        <div style={{ 
          wordWrap: 'break-word', 
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          lineHeight: '1.4'
        }}>
          {text}
        </div>
      )
    },
    { 
      title: t('overview.storeKeyMetrics.contactPhoneNumber'), 
      dataIndex: 'contact_phone_number', 
      width: 180,
      render: (text: string) => (
        <div style={{ 
          wordWrap: 'break-word', 
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          lineHeight: '1.4'
        }}>
          {text}
        </div>
      )
    },
    { 
      title: t('overview.storeKeyMetrics.totalOrders'), 
      dataIndex: 'total_orders', 
      width: 150,
    },
    { 
      title: t('overview.storeKeyMetrics.totalRevenue'), 
      dataIndex: 'total_revenue', 
      width: 180,
      align: 'right' as const,
      render: (value: number) => formatCurrencyCompact(value),
    },
  ]

  const data = useMemo(
    () =>
      storeKeyMetrics?.map((storeKeyMetric) => ({
        id: storeKeyMetric.id,
        name: storeKeyMetric.name,
        address: storeKeyMetric.address,
        contact_phone_number: storeKeyMetric.contact_phone_number,
        tenant_id: storeKeyMetric.tenant_id,
        total_orders: storeKeyMetric.total_orders,
        total_revenue: storeKeyMetric.total_revenue,
      })),
    [storeKeyMetrics]
  );

  return (
    <Table
      dataSource={data}
      columns={columns}
      scroll={{ x: 960 }}
      style={{
        width: '100%',
      }}
      pagination={false}
      sticky
    />
  );
};
