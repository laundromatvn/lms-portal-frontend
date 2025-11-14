import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  Skeleton,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';
import type { OverviewOrder } from '@shared/types/dashboard/OverviewOrder';

import { useListOverviewOrderApi } from '@shared/hooks/dashboard/useListOverviewOrderApi';

import { Box } from '@shared/components/Box';

import { TopOrderOverviewItem } from './Item';

interface Props {
  store: Store;
}

export const TopOrderOverviewList: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    listOverviewOrder,
    data: listOverviewOrderData,
    loading: listOverviewOrderLoading,
  } = useListOverviewOrderApi();

  useEffect(() => {
    listOverviewOrder({
      store_id: store.id,
      page: 1,
      page_size: 5,
    });
  }, []);

  return (
    <Box
      vertical
      gap={theme.custom.spacing.medium}
      style={{ width: '100%' }}
    >
      {listOverviewOrderLoading ? (
        <Skeleton active />
      ) : (
        listOverviewOrderData?.data.map((order) => (
          <TopOrderOverviewItem order={order as OverviewOrder} />
        ))
      )}

      <Typography.Link onClick={() => navigate('/orders')} style={{ width: '100%', textAlign: 'center' }}>
        {t('common.loadMore')}
      </Typography.Link>
    </Box>
  );
};
