import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Typography,
  Skeleton,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';

import { TopOrderOverviewList } from './List';

interface Props {
  store: Store;
}

export const TopOrderOverview: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Typography.Text strong style={{ fontSize: theme.custom.fontSize.large }}>
        {t('overviewV2.topOrderOverview', { topOrders: 5 })}
      </Typography.Text>

      <TopOrderOverviewList store={store} />
    </Flex>
  );
};
