import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider, Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';
import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';

import { Box } from '@shared/components/Box';

import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  subscriptionPlan: SubscriptionPlan;
  billingType: SubscriptionPricingBillingTypEnum;
}

export const SubscriptionPlanCard: React.FC<Props> = ({
  subscriptionPlan,
  billingType,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // TODO: Add background color based on subscription plan id
  const backgroundColor = theme.custom.colors.primary.light;

  const pricingOption = useMemo(() => subscriptionPlan.pricing_options.find((pricingOption) => pricingOption.billing_type === billingType), [subscriptionPlan, billingType]);

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
        <Typography.Title level={4} style={{ marginBottom: 0, color: theme.custom.colors.primary.dark }}>
          {subscriptionPlan.name}
        </Typography.Title>

        {billingType === SubscriptionPricingBillingTypEnum.RECURRING ? (
          <Typography.Text strong style={{ whiteSpace: 'nowrap', fontSize: theme.custom.fontSize.xxxlarge }}>
            {formatCurrencyCompact(pricingOption?.base_unit_price ?? 0)}
            <Typography.Text type='secondary'>
              {' '}/{pricingOption?.interval_count ?? 0} {t(`subscription.billingIntervals.${pricingOption?.billing_interval ?? 'MONTH'}`)}
            </Typography.Text>
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">
            {formatCurrencyCompact(pricingOption?.base_unit_price ?? 0)}
          </Typography.Text>
        )}

        <Flex style={{ width: '50%' }}>
          <Divider style={{
            borderColor: theme.custom.colors.text.primary,
            marginTop: 0,
            marginBottom: 0,
          }} />
        </Flex>

        <Typography.Paragraph
          type="secondary"
          ellipsis={{
            rows: 3,
            expandable: true,
            symbol: 'more',
          }}
        >
          {subscriptionPlan.description}
        </Typography.Paragraph>
      </Flex>
    </Box>
  );
};
