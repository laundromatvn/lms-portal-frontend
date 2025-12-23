import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
} from 'antd';


import { useTheme } from '@shared/theme/useTheme';

import {
  useGetMachineStatusLineChartApi,
  type GetMachineStatusLineChartResponse,
} from '@shared/hooks/dashboard/useGetMachineStatusLineChartApi';

import type { Store } from '@shared/types/store';

import { BaseSectionTitle } from '@shared/components/BaseSectionTitle';
import { Box } from '@shared/components/Box';
import { Column, Line } from '@ant-design/plots';

interface Props {
  store: Store;
  filters: Record<string, any>;
}

export const MobileView: React.FC<Props> = ({ store, filters }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    getMachineStatusLineChart,
    data: getMachineStatusLineChartData,
    loading: getMachineStatusLineChartLoading,
  } = useGetMachineStatusLineChartApi<GetMachineStatusLineChartResponse>();

  const handleGetMachineStatusLineChart = () => {
    getMachineStatusLineChart({
      store_id: store.id,
    });
  };

  useEffect(() => {
    handleGetMachineStatusLineChart();
  }, [store.id]);

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <BaseSectionTitle
        title={t('overviewV2.machineStatus')}
        onRefresh={handleGetMachineStatusLineChart}
      />

      <Box
        vertical gap={theme.custom.spacing.medium}
        style={{ width: '100%' }}
      >
        <Column
          data={getMachineStatusLineChartData || []}
          loading={getMachineStatusLineChartLoading}
          style={{ width: '100%' }}
          xField="date"
          yField="value"
          seriesField="label"
          color="label"
        />
      </Box>
    </Flex>
  );
};
