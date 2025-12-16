import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, Table, Typography } from 'antd';

import {
  useListOrderDetailApi,
  type ListOrderDetailResponse,
} from '@shared/hooks/useListOrderDetailApi';

import { type Order } from '@shared/types/Order';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  order?: Order;
}

export const TableView: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { title: t('common.machineName'), dataIndex: 'machine_name', width: 200,
      render: (_: string, record: any) => (
        <Typography.Link
          onClick={() => navigate(`/machines/${record.machine_id}/detail`)}
          style={{ cursor: 'pointer' }}
        >
          {t('common.machine')} {record.machine_name || record.machine_relay_no}
        </Typography.Link>
      ),
    },
    { title: t('common.machineType'), dataIndex: 'machine_type', width: 200,
      render: (text: string) => (
        <DynamicTag value={text} />
      ),
    },
    { title: t('common.price'), dataIndex: 'price', width: 200,
      render: (text: string) => (
        <Typography.Text style={{ textAlign: 'right', width: '100%' }}>
          {formatCurrencyCompact(text)}
        </Typography.Text>
      ),
    },
    { title: t('common.status'), dataIndex: 'status', width: 200,
      render: (text: string) => (
        <DynamicTag value={text} />
      ),
    },
  ];

  const {
    listOrderDetail,
    data: listOrderDetailData,
    loading: listOrderDetailLoading,
  } = useListOrderDetailApi<ListOrderDetailResponse>();

  useEffect(() => {
    if (order?.id) {
      listOrderDetail({
        order_id: order?.id,
        page,
        page_size: pageSize
      });
    }
  }, [page, pageSize, order?.id]);

  return (
    <BaseDetailSection title={t('common.orderDetailList')} >
      <Flex vertical style={{ width: '100%', overflow: 'auto' }}>
        <Table
          dataSource={listOrderDetailData?.data}
          columns={columns}
          pagination={{
            pageSize,
            current: page,
            total: listOrderDetailData?.total,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
              listOrderDetail({
                order_id: order?.id as string,
                page,
                page_size: pageSize
              });
            },
          }}
          loading={listOrderDetailLoading}
          style={{ width: '100%' }}
        />
      </Flex>
    </BaseDetailSection>
  );
};
