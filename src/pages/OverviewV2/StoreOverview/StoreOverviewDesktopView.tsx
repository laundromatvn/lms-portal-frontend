import React from 'react';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { Store } from '@shared/types/store';

import { StoreKeyMetrics } from './StoreKeyMetrics';
import { TopOrderOverview } from './TopOrderOverview';
import { MachineOverview } from './MachineOverview';

interface Props {
  store: Store;
}

export const StoreOverviewDesktopView: React.FC<Props> = ({ store }) => {
  const theme = useTheme();

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%', height: '100%' }}>
      <StoreKeyMetrics store={store} />
      <TopOrderOverview store={store} />
      <MachineOverview store={store} />
    </Flex>
  );
};
