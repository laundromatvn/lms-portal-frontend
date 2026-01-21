import React, { useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { Button, Flex, Typography } from 'antd';

import { ArrowRight } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type Tenant } from '@shared/types/tenant';

import { type SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';
import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { Box } from '@shared/components/Box';
import { DataWrapper } from '@shared/components/DataWrapper';

import formatCurrencyCompact from '@shared/utils/currency';


interface Props {
  pricingOptions: SubscriptionPricingOption[];
  selectedPricingOption: SubscriptionPricingOption | null;
  onSelect: (pricingOption: SubscriptionPricingOption) => void;
}

export const SelectPricingOptionSection: React.FC<Props> = ({ pricingOptions, selectedPricingOption, onSelect }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const filteredPricingOptions: SubscriptionPricingOption[] = pricingOptions.filter((pricingOption) => (
    pricingOption.billing_type === SubscriptionPricingBillingTypEnum.RECURRING
    && pricingOption.trial_period_days > 0
  ));

  return (
    <BaseDetailSection
      title={t('tenant.selectPricingOption')}
    >
      {filteredPricingOptions.sort((a, b) => a.base_unit_price - b.base_unit_price).map((pricingOption) => (
        <Box
          border
          key={pricingOption.id}
          style={{
            width: '100%',
            maxWidth: 600,
            padding: theme.custom.spacing.medium,
            backgroundColor: theme.custom.colors.background.light,
          }}
        >
          <Flex vertical gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
            <Typography.Text
              type='secondary'
            >
              <Typography.Text strong>{formatCurrencyCompact(pricingOption.base_unit_price)}</Typography.Text>

              <Typography.Text type='secondary'>
                {' '}/{t(`subscription.pricingUnits.${pricingOption.pricing_unit}`)}
              </Typography.Text>

              <Typography.Text type='secondary'>
                {' '}/{pricingOption.interval_count} {t(`subscription.billingIntervals.${pricingOption.billing_interval}`)}
              </Typography.Text>
            </Typography.Text>

            <Typography.Text type='secondary'>
              <Trans
                i18nKey="tenant.trialPeriodDays"
                values={{ trialPeriodDays: pricingOption.trial_period_days }}
                components={{ strong: <Typography.Text strong /> }}
              />
            </Typography.Text>
          </Flex>

          <Flex align="center" justify="end" gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
            <Button
              type="link"
              onClick={() => onSelect(pricingOption)}
            >
              {t('common.select')} <ArrowRight />
            </Button>
          </Flex>
        </Box>
      ))}
    </BaseDetailSection>
  );
};
