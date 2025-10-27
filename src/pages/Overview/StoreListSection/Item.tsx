import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { OverviewStoreKeyMetrics } from '@shared/types/dashboard/OverviewStoreKeyMetrics';

import { Box } from '@shared/components/Box';

import formatCurrencyCompact from '@shared/utils/currency';

interface StoreListSectionItemProps {
  index: number;
  store: OverviewStoreKeyMetrics;
}

export const StoreListSectionItem: React.FC<StoreListSectionItemProps> = ({ index, store }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box border align="center" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Flex vertical justify="start" gap={theme.custom.spacing.small} style={{ flex: 3, height: '100%' }}>
        <Typography.Link strong onClick={() => navigate(`/stores/${store.id}/detail`)}>{store.name}</Typography.Link>
        <Typography.Text type="secondary">{store.contact_phone_number || '-'} | {store.address || '-'}</Typography.Text>
      </Flex>

      <Flex vertical justify="start" align="end" gap={theme.custom.spacing.small} style={{ flex: 1, height: '100%' }}>
        <Typography.Text strong style={{ color: theme.custom.colors.success.default }}>
          {formatCurrencyCompact(store.total_revenue)}
        </Typography.Text>

        <Typography.Text type="secondary">
          {store.total_orders} {t('common.orders')}
        </Typography.Text>
      </Flex>
    </Box>
  )
}
