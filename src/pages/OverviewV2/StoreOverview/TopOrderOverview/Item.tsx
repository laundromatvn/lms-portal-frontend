import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography } from 'antd';

import {
  Dollar,
  TrashBinTrash,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { OverviewOrder } from '@shared/types/dashboard/OverviewOrder';

import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';

import formatCurrencyCompact from '@shared/utils/currency';

interface Props {
  order: OverviewOrder;
}

export const TopOrderOverviewItem: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      vertical
      border
      justify="space-between"
      align="center"
      gap={theme.custom.spacing.small}
      style={{
        width: '100%',
        padding: theme.custom.spacing.medium,
        overflow: 'hidden',
      }}
    >
      <Flex justify="space-between" align="center" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
        <Typography.Link strong onClick={() => navigate(`/orders/${order.id}/detail`)}>
          {order.transaction_code}
        </Typography.Link>
        <DynamicTag value={order.status} />
      </Flex>

      <Flex gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
        <Typography.Text type="secondary">
          {t('overviewV2.noWashers', { noWashers: order.total_washer })} | {t('overviewV2.noDryers', { noDryers: order.total_dryer })}
        </Typography.Text>
      </Flex>

      <Flex justify="space-between" align="center" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
        <Typography.Text strong style={{ color: theme.custom.colors.success.default }}>
          {formatCurrencyCompact(order.total_amount)}
        </Typography.Text>

        {/* <Flex gap={theme.custom.spacing.small}>
          <Button
            type="default"
            icon={<Dollar />}
            onClick={() => { }}
          />

          <Button
            type="default"
            icon={<TrashBinTrash />}
            onClick={() => { }}
          />
        </Flex> */}
      </Flex>
    </Box>
  );
};
