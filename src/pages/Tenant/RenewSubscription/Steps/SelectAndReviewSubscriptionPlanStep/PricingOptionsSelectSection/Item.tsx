import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import type { SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';

import { Box } from '@shared/components/Box';

import { formatCurrencyCompact } from '@shared/utils/currency';
import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';

interface Props {
  pricingOption: SubscriptionPricingOption;
  onSelect?: () => void;
  selected?: boolean;
  current?: boolean;
}

export const PricingOptionsSelectSectionItem: React.FC<Props> = ({
  pricingOption,
  selected,
  current,
  onSelect,
}: Props) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <Box
      vertical
      gap={theme.custom.spacing.small}
      style={{
        width: isMobile ? '100%' : 'auto',
        minWidth: 240,
        padding: theme.custom.spacing.large,
        backgroundColor: selected
          ? theme.custom.colors.primary.light
          : theme.custom.colors.background.light,
        border: selected
          ? `2px solid ${theme.custom.colors.primary.default}`
          : `1px solid ${theme.custom.colors.neutral[200]}`,
      }}
      onClick={onSelect}
    >
      <Typography.Text strong>
        {formatCurrencyCompact(pricingOption.base_unit_price)}
        <Typography.Text type='secondary'>
          {' '}/{t(`subscription.pricingUnits.${pricingOption.pricing_unit}`)}
        </Typography.Text>
        {pricingOption.billing_type === SubscriptionPricingBillingTypEnum.RECURRING && (
          <Typography.Text type='secondary'>
            {' '}/{pricingOption.interval_count} {t(`subscription.billingIntervals.${pricingOption.billing_interval}`)}
          </Typography.Text>
        )}
      </Typography.Text>
    </Box>
  );
};
