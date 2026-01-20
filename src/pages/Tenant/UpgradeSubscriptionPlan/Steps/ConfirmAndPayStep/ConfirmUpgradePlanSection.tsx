import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button, Flex, Typography } from 'antd';

import { InfoCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { PreviewSubscriptionInvoiceResponse } from '@shared/hooks/subscription/usePreviewSubscriptionInvoiceApi';
import type { SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { Box } from '@shared/components/Box';
import { DataWrapper } from '@shared/components/DataWrapper';

import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  subscriptionPlan: SubscriptionPlan;
  previewSubscriptionInvoiceResult: PreviewSubscriptionInvoiceResponse | null;
  onConfirmed: () => void;
}

export const ConfirmUpgradePlanSection: React.FC<Props> = ({ subscriptionPlan, previewSubscriptionInvoiceResult, onConfirmed }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <BaseDetailSection style={{ padding: 0 }}>
      {previewSubscriptionInvoiceResult && (
        <Box
          vertical
          gap={theme.custom.spacing.medium}
          style={{
            width: '100%',
            border: `1px solid ${theme.custom.colors.neutral[200]}`,
            borderRadius: theme.custom.radius.large,
            padding: theme.custom.spacing.medium,
            marginBottom: theme.custom.spacing.medium,
          }}
        >
          <DataWrapper title={t('subscription.baseAmount')}>
            <Typography.Text>
              {formatCurrencyCompact(previewSubscriptionInvoiceResult.base_amount)}
            </Typography.Text>
          </DataWrapper>

          <DataWrapper title={t('subscription.discountAmount')}>
            <Typography.Text>
              {formatCurrencyCompact(previewSubscriptionInvoiceResult.discount_amount)}
            </Typography.Text>
          </DataWrapper>

          <DataWrapper title={t('subscription.finalAmount')}>
            <Typography.Text strong style={{ color: theme.custom.colors.success[700] }}>
              {formatCurrencyCompact(previewSubscriptionInvoiceResult.final_amount)}
            </Typography.Text>
          </DataWrapper>
        </Box>
      )}

      <Box
        gap={theme.custom.spacing.medium}
        style={{
          width: '100%',
          border: `1px solid ${theme.custom.colors.warning.default}`,
          backgroundColor: theme.custom.colors.warning.light,
        }}
      >
        <InfoCircle size={32} weight='BoldDuotone' color={theme.custom.colors.warning.default} />

        <Flex vertical gap={theme.custom.spacing.small} style={{ width: '100%' }}>
          <Typography.Text>
            <Trans
              i18nKey="subscription.doYouWantToUpgradeYourSubscriptionPlan"
              values={{ subscriptionPlanName: subscriptionPlan.name }}
              components={{ strong: <Typography.Text strong /> }}
            />
          </Typography.Text>

          <Button
            size="large"
            onClick={onConfirmed}
            style={{
              width: '100%',
              backgroundColor: theme.custom.colors.warning.default,
              fontWeight: theme.custom.fontWeight.large,
              border: 'none',
            }}
          >
            {t('subscription.upgradeNow')}
          </Button>
        </Flex>
      </Box>
    </BaseDetailSection>
  );
};
