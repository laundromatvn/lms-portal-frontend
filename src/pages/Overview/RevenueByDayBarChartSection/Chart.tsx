import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Column } from '@ant-design/plots';

import formatCurrencyCompact from '@shared/utils/currency';

type Props = {
  labels?: string[];
  values?: number[];
  height?: number;
};

export const RevenueByDayBarChart: React.FC<Props> = ({ labels, values, height = 320 }) => {
  const { t } = useTranslation();

  const data = useMemo(
    () =>
      labels?.map((label, index) => ({
        label,
        value: values?.[index] ?? 0,
      })),
    [labels, values]
  );

  const config = useMemo(
    () => ({
      data,
      xField: 'label',
      yField: 'value',
      height,
      columnStyle: {
        radiusTopLeft: 4,
        radiusTopRight: 4,
      },
      axis: {
        x: {
          labelFormatter: (d: string) => d,
        },
        y: {
          labelFormatter: (val: number) => formatCurrencyCompact(val),
          title: t('overview.revenueByDay.revenue'),
          tickCount: 5,
        },
      },
      tooltip: {
        items: [
          {
            field: 'value',
            name: t('overview.revenueByDay.revenue'),
            valueFormatter: (val: number) => formatCurrencyCompact(val),
          },
        ],
      },
      interactions: [{ type: 'element-highlight' }],
    }),
    [data, height]
  );

  return (
    <div style={{ width: '100%' }}>
      <Column {...config} />
    </div>
  );
};
