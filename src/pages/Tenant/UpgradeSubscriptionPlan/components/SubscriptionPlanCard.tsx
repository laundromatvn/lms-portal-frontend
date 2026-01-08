import React from 'react';
import { useTranslation } from 'react-i18next';

import { Divider, Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';

import { Box } from '@shared/components/Box';

import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  subscriptionPlan: SubscriptionPlan;
}

export const SubscriptionPlanCard: React.FC<Props> = ({
  subscriptionPlan,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // TODO: Add background color based on subscription plan id
  const backgroundColor = theme.custom.colors.primary[300];

  return (
    <Box
      vertical
      justify="space-between"
      style={{
        width: '100%',
        maxWidth: 420,
        height: '100%',
        minHeight: 480,
        padding: theme.custom.spacing.large,
        backgroundColor,
      }}
    >
      <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%', height: '100%' }}>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          {subscriptionPlan.name}
        </Typography.Title>

        <Flex align="center" gap={theme.custom.spacing.xxsmall}>
          <Typography.Text style={{
            fontSize: theme.custom.fontSize.xxxxlarge,
            fontWeight: theme.custom.fontWeight.xxlarge,
            color: theme.custom.colors.text.primary,
          }}>
            {formatCurrencyCompact(subscriptionPlan.price)}
          </Typography.Text>

          <Typography.Text
            type="secondary"
            style={{
              fontSize: theme.custom.fontSize.small,
            }}>
            {t('subscription.pricePerInterval', { count: subscriptionPlan.interval_count || 0, interval: t(`subscription.${subscriptionPlan.interval?.toLowerCase()}`) })}
          </Typography.Text>
        </Flex>

        <Flex style={{ width: '50%' }}>
          <Divider style={{
            borderColor: theme.custom.colors.text.primary,
            marginTop: 0,
            marginBottom: 0,
          }} />
        </Flex>

        <Typography.Paragraph
          ellipsis={{
            rows: 3,
            expandable: true,
            symbol: 'more',
          }}
          style={{
            color: theme.custom.colors.text.primary,
          }}
        >
          {subscriptionPlan.description}
        </Typography.Paragraph>
      </Flex>
    </Box>
  );
};
