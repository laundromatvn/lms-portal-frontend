import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Divider, Flex, Typography } from 'antd';

import { CheckCircle, CloseCircle, Play } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { OverviewOrder } from '@shared/types/dashboard/OverviewOrder';

import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';
import { PaymentStatusEnum } from '@shared/enums/PaymentStatusEnum';
import { BaseModal } from '@shared/components/BaseModal';

import { StartOrderMachinesModalContent } from './StartOrderMachinesModalContent';

import { formatDateTime } from '@shared/utils/date';
import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  order: OverviewOrder;
}

export const OverviewOrderListItem: React.FC<Props> = ({ order }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [isStartOrderMachinesModalOpen, setIsStartOrderMachinesModalOpen] = useState(false);

  return (
    <Box border vertical justify="space-between" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Flex style={{ width: '100%' }}>
        <Flex vertical gap={theme.custom.spacing.small} style={{ flex: 3 }}>
          <Typography.Link strong onClick={() => navigate(`/orders/${order.id}/detail`)}>{order.transaction_code}</Typography.Link>

          <Flex gap={theme.custom.spacing.xsmall}>
            <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.small }}>
              {formatDateTime(order.created_at)}
            </Typography.Text>


          </Flex>
        </Flex>

        <Flex vertical align="end" gap={theme.custom.spacing.small} style={{ flex: 1 }}>
          <DynamicTag value={order.status} />

          <Typography.Text strong style={{ color: theme.custom.colors.success.default }}>
            {order.payment_status === PaymentStatusEnum.SUCCESS ? (
              <CheckCircle style={{ marginLeft: theme.custom.spacing.xsmall, marginRight: theme.custom.spacing.xsmall }} />
            ) : (
              <CloseCircle style={{ marginLeft: theme.custom.spacing.xsmall, marginRight: theme.custom.spacing.xsmall }} />
            )}

            {formatCurrencyCompact(order.total_amount)}
          </Typography.Text>
        </Flex>
      </Flex>

      <Divider style={{ margin: 0 }} />

      <Flex justify="end" style={{ width: '100%' }}>
        <Button
          type="text"
          icon={<Play weight="Bold" />}
          style={{ color: theme.custom.colors.success.default }}
          onClick={() => setIsStartOrderMachinesModalOpen(true)}
        />
      </Flex>

      <BaseModal
        open={isStartOrderMachinesModalOpen}
        onCancel={() => setIsStartOrderMachinesModalOpen(false)}
        closable={true}
        isModalOpen={isStartOrderMachinesModalOpen}
        setIsModalOpen={setIsStartOrderMachinesModalOpen}
      >
        <StartOrderMachinesModalContent order={order} />
      </BaseModal>
    </Box>
  );
};
