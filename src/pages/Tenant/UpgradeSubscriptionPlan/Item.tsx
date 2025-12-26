import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Divider, Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';

import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  index: number;
  isCurrent: boolean;
  subscriptionPlan: SubscriptionPlan;
  onSelect: (value: SubscriptionPlan) => void;
}

export const UpgradeSubscriptionPlanItem: React.FC<Props> = ({
  index,
  isCurrent,
  subscriptionPlan,
  onSelect,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const backgroundColor = useMemo(() => {
    const remainder = index % 5;

    switch (remainder) {
      case 0:
        return theme.custom.colors.info[300];
      case 1:
        return theme.custom.colors.success[300];
      case 2:
        return theme.custom.colors.warning[300];
      case 3:
        return theme.custom.colors.danger[300];
      case 4:
        return theme.custom.colors.accent_1[300];
    }
  }, [index]);

  return (
    <Box
      vertical
      onClick={() => onSelect(subscriptionPlan)}
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
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            {subscriptionPlan.name}
          </Typography.Title>

          {isCurrent && (
            <DynamicTag
              type="default"
              value={t('subscriptionPlan.current')}
              color={theme.custom.colors.accent_1[400]}
            />
          )}
        </Flex>

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
            {t('subscriptionPlan.pricePerInterval', { count: subscriptionPlan.interval_count || 0, interval: t(`subscriptionPlan.${subscriptionPlan.interval?.toLowerCase()}`) })}
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
          {t('subscriptionPlan.getStarted')}
        </Button>
      </Flex>
    </Box>
  );
};
