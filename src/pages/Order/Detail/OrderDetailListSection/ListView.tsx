import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, List, Typography } from 'antd';

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

export const ListView: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
        <List
          dataSource={listOrderDetailData?.data}
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
                <Flex justify="space-between" align="center" gap={theme.custom.spacing.small}>
                  <Typography.Link strong onClick={() => navigate(`/machines/${item.machine_id}/detail`)}>
                    {`${t('common.machine')} ${item.machine_name || item.machine_relay_no}`}
                  </Typography.Link>

                  <DynamicTag value={item.status} style={{ marginRight: 0 }} />
                </Flex>

                <Flex justify="space-between" align="center" gap={theme.custom.spacing.small}>
                  <Typography.Text type="secondary">
                    {item.machine_type}
                  </Typography.Text>

                  <Typography.Text strong style={{ color: theme.custom.colors.success.default }}>
                    {formatCurrencyCompact(item.price)}
                  </Typography.Text>
                </Flex>
              </Flex>
            </List.Item>
          )}
        />
      </Flex>
    </BaseDetailSection>
  );
};
