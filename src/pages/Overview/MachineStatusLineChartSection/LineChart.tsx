import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Line } from '@ant-design/plots';

import { useTheme } from '@shared/theme/useTheme';

type MachineStatusDatapoint = {
  date: string;
  label: string;
  value: string;
};

type Props = {
  data: MachineStatusDatapoint[];
};

const STATUS_VALUE_MAP: Record<string, number> = {
  UNKNOWN: 0,
  IDLE: 1,
  BUSY: 2,
} as const;

const VALUE_STATUS_MAP: Record<number, string> = Object.entries(STATUS_VALUE_MAP).reduce(
  (acc, [status, value]) => ({ ...acc, [value]: status === 'UNKNOWN' ? 'UNKNOWN' : status }),
  {} as Record<number, string>
);


export const MachineStatusLineChart: React.FC<Props> = ({ data: machineStatusData }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const data = useMemo(() => {
    return machineStatusData?.map((dataPoint) => ({
      date: dataPoint.date,
      label: dataPoint.value || '',
      value: STATUS_VALUE_MAP[dataPoint.value] ?? STATUS_VALUE_MAP['UNKNOWN'],
    }));
  }, [machineStatusData]);

  const config = {
    data,
    xField: 'date',
    yField: 'value',
    axis: {
      y: {
        tickMethod: () => Object.values(STATUS_VALUE_MAP).sort((a, b) => a - b),
        labelFormatter: (v: number) => {
          const status = VALUE_STATUS_MAP[v];
          return status ? t(status) : String(v);
        },
      },
    },
    style: {
      line: {
        strokeWidth: 2,
      },
    },
    legend: {
      position: 'bottom',
    },
  };

  return (
    <div style={{ width: '100%' }}>
      <Line {...config} />
    </div>
  );
};