import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Column } from '@ant-design/plots';

type Props = {
  labels?: string[];
  values?: number[];
  height?: number;
};

export const OrderByDayBarChart: React.FC<Props> = ({ labels, values, height = 320 }) => {
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
          labelFormatter: (val: number) => val,
          title: t('overview.totalOrdersByDay.orderCount'),
        },
      },
      tooltip: {
        items: [
          {
            field: 'value',
            name: t('overview.totalOrdersByDay.orderCount'),
            valueFormatter: (val: number) => val,
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
