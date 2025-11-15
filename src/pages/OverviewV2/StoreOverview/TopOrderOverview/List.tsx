import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  Skeleton,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { OverviewOrder } from '@shared/types/dashboard/OverviewOrder';

import { Box } from '@shared/components/Box';

import { TopOrderOverviewItem } from './Item';

interface Props {
  orders: OverviewOrder[];
  loading: boolean;
}

export const TopOrderOverviewList: React.FC<Props> = ({ orders, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      vertical
      gap={theme.custom.spacing.medium}
      style={{
        width: '100%',
        overflow: 'auto',
      }}
      loading={loading}
    >
      {orders.map((order) => (
        <TopOrderOverviewItem order={order as OverviewOrder} />
      ))}

      <Typography.Link onClick={() => navigate('/orders')} style={{ width: '100%', textAlign: 'center' }}>
        {t('common.loadMore')}
      </Typography.Link>
    </Box>
  );
};
