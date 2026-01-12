import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Divider, Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';

import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatCurrencyCompact } from '@shared/utils/currency';
import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';

interface Props {
  selectedBillingType: SubscriptionPricingBillingTypEnum;
  isCurrent: boolean;
  subscriptionPlan: SubscriptionPlan;
  onSelect: (value: SubscriptionPlan, primaryColor: string) => void;
}

export const SubscriptionPlanSelectItem: React.FC<Props> = ({
  selectedBillingType,
  isCurrent,
  subscriptionPlan,
  onSelect,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const backgroundColor = theme.custom.colors.primary.light;

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
        <Flex justify="space-between" align="center" gap={theme.custom.spacing.xsmall}>
          <Typography.Title level={4} style={{ marginBottom: 0, color: theme.custom.colors.primary.dark }}>
            {subscriptionPlan.name}
          </Typography.Title>

          {isCurrent && (
            <DynamicTag
              type="default"
              value={t('subscription.current')}
              color={theme.custom.colors.accent_1[400]}
            />
          )}
        </Flex>

        <Flex vertical gap={theme.custom.spacing.small} style={{ whiteSpace: 'nowrap' }}>
          {subscriptionPlan.pricing_options.filter((pricingOption) => pricingOption.billing_type === selectedBillingType).map((pricingOption) => {
            if (selectedBillingType === SubscriptionPricingBillingTypEnum.RECURRING) {
              return (
                <Typography.Text strong style={{ whiteSpace: 'nowrap', fontSize: theme.custom.fontSize.xxxlarge }}>
                  {formatCurrencyCompact(pricingOption.base_unit_price)}
                  <Typography.Text type='secondary'>
                    {' '}/{pricingOption.interval_count} {t(`subscription.billingIntervals.${pricingOption.billing_interval}`)}
                  </Typography.Text>
                </Typography.Text>
              );
            }

            return (
              <Typography.Text strong style={{ whiteSpace: 'nowrap', fontSize: theme.custom.fontSize.xxxlarge }}>
                {formatCurrencyCompact(pricingOption.base_unit_price)}
              </Typography.Text>
            );
          })}
        </Flex>

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

      <Flex justify="flex-end" style={{ width: '100%' }}>
        <Button
          size="large"
          onClick={() => onSelect(subscriptionPlan, backgroundColor)}
          disabled={isCurrent}
          style={{
            marginTop: theme.custom.spacing.large,
            backgroundColor: theme.custom.colors.background.dark,
            borderColor: theme.custom.colors.background.dark,
            fontWeight: theme.custom.fontWeight.xlarge,
            color: theme.custom.colors.text.inverted,
            padding: theme.custom.spacing.large,
          }}
        >
          {t('subscription.getStarted')}
        </Button>
      </Flex>
    </Box>
  );
};
