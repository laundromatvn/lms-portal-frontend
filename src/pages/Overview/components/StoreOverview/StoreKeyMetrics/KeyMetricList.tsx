import React from 'react';

import { Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { StoreKeyMetricsItem } from './Item';

import type { StoreKeyMetrics as StoreKeyMetricsType } from './types';

interface Props {
  keyMetrics: StoreKeyMetricsType[];
}

export const KeyMetricList: React.FC<Props> = ({ keyMetrics }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <Flex vertical={isMobile} gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      {keyMetrics.map((keyMetric) => (
        <StoreKeyMetricsItem
          title={keyMetric.label}
          value={keyMetric.value}
          description={keyMetric.description}
          icon={keyMetric.icon}
        />
      ))}
    </Flex>
  );
};
