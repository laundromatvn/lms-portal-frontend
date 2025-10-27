import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Table, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

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

export const OrderDetailListSection: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { title: t('common.machineName'), dataIndex: 'machine_name', width: 200 },
    { title: t('common.machineType'), dataIndex: 'machine_type', width: 200 },
    { title: t('common.price'), dataIndex: 'price', width: 200 },
    { title: t('common.status'), dataIndex: 'status', width: 200 },
  ];

  const {
    listOrderDetail,
    data: listOrderDetailData,
    loading: listOrderDetailLoading,
  } = useListOrderDetailApi<ListOrderDetailResponse>();

  useEffect(() => {
    if (listOrderDetailData) {
      setDataSource(listOrderDetailData.data.map((item) => ({
        id: item.id,
        machine_name: <Typography.Link onClick={() => navigate(`/machines/${item.machine_id}/detail`)}>{item.machine_name || '-'}</Typography.Link>,
        machine_type: <DynamicTag value={item.machine_type as string} />,
        price: formatCurrencyCompact(item.price),
        status: <DynamicTag value={item.status} />,
      })));
    }
  }, [listOrderDetailData]);

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
    <BaseDetailSection title={t('common.orderDetailList')}>
      <Table
        dataSource={dataSource}
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
    </BaseDetailSection>
  );
};
