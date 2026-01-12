import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button, Flex, Typography } from 'antd';

import { InfoCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { Box } from '@shared/components/Box';

interface Props {
  subscriptionPlan: SubscriptionPlan;
  onConfirmed: () => void;
}

export const ConfirmUpgradePlanSection: React.FC<Props> = ({ subscriptionPlan, onConfirmed }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <BaseDetailSection style={{ padding: 0 }}>
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
