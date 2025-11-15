import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Typography,
  Skeleton,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';

import { MachineOverviewList } from './List';

interface Props {
  store: Store;
}

export const MachineOverview: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Typography.Text strong style={{ fontSize: theme.custom.fontSize.large }}>
        {t('overviewV2.machineOverview')}
      </Typography.Text>

      <MachineOverviewList store={store} />
    </Flex>
  );
};
