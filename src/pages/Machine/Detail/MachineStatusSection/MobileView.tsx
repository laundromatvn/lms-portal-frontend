import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Steps,
  Flex,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useGetMachineStatusLineChartApi,
  type GetMachineStatusLineChartResponse,
} from '@shared/hooks/dashboard/useGetMachineStatusLineChartApi';

import type { Machine } from '@shared/types/machine';

import { MachineStatusEnum } from '@shared/enums/MachineStatusEnum';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  machine: Machine;
}

export const MobileView: React.FC<Props> = ({ machine }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    getMachineStatusLineChart,
    data: getMachineStatusLineChartData,
  } = useGetMachineStatusLineChartApi<GetMachineStatusLineChartResponse>();

  const handleGetMachineStatusLineChart = () => {
    getMachineStatusLineChart({
      machine_id: machine.id,
    });
  };

  useEffect(() => {
    handleGetMachineStatusLineChart();
  }, [machine.id]);

  return (
    <BaseDetailSection
      title={t('machine.machineStatusTimeline')}
      onRefresh={handleGetMachineStatusLineChart}
    >
      <Flex gap={theme.custom.spacing.medium} style={{ width: '100%', overflow: 'auto' }}>
        <Steps
          direction="vertical"
          progressDot
          size="small"
          current={10}
          items={(getMachineStatusLineChartData?.slice(0, 10) || []).map((item) => ({
            title: (
              <DynamicTag value={item.value} type="text" />
            ),
            description: item.date,
            color: item.value == MachineStatusEnum.BUSY ? theme.custom.colors.warning.default : theme.custom.colors.success.default,
          }))}
          style={{ width: '100%' }}
        />
      </Flex>
    </BaseDetailSection>
  );
};
