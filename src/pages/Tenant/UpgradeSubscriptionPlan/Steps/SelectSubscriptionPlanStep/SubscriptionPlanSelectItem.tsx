import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Divider, Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';
import { type SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';

import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatCurrencyCompact } from '@shared/utils/currency';
import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';

interface Props {
  selectedBillingType: SubscriptionPricingBillingTypEnum;
  isCurrent: boolean;
  subscriptionPlan: SubscriptionPlan;
  onSelect: (value: SubscriptionPlan) => void;
}

export const SubscriptionPlanSelectItem: React.FC<Props> = ({
  selectedBillingType,
  isCurrent,
  subscriptionPlan,
  onSelect,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();


  const [primaryPricingOption, setPrimaryPricingOption] = useState<SubscriptionPricingOption | undefined>(undefined);
  const backgroundColor = theme.custom.colors.primary.light;

  useEffect(() => {
    if (subscriptionPlan.pricing_options.length === 0) return;

    const sortedPricingOptions = subscriptionPlan.pricing_options.filter((pricingOption) => pricingOption.billing_type === selectedBillingType).sort((a, b) => {
      return a.base_unit_price - b.base_unit_price;
    });

    setPrimaryPricingOption(sortedPricingOptions[0]);
  }, [subscriptionPlan]);

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
          {selectedBillingType === SubscriptionPricingBillingTypEnum.RECURRING && (
            <Typography.Text strong style={{ whiteSpace: 'nowrap', fontSize: theme.custom.fontSize.xxxlarge }}>
              {formatCurrencyCompact(primaryPricingOption?.base_unit_price || 0)}
              <Typography.Text type='secondary'>
                {' '}/{primaryPricingOption?.interval_count} {t(`subscription.billingIntervals.${primaryPricingOption?.billing_interval}`)}
              </Typography.Text>
            </Typography.Text>
          )}

          {selectedBillingType === SubscriptionPricingBillingTypEnum.ONE_TIME && (
            <Typography.Text strong style={{ whiteSpace: 'nowrap', fontSize: theme.custom.fontSize.xxxlarge }}>
              {formatCurrencyCompact(primaryPricingOption?.base_unit_price || 0)}
            </Typography.Text>
          )}
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
          onClick={() => onSelect(subscriptionPlan)}
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
