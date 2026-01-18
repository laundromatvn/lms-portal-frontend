import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import type { SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';

import { PricingOptionsSelectSectionItem } from './Item';

interface Props {
  pricingOptions: SubscriptionPricingOption[];
  selectedPricingOption: SubscriptionPricingOption | null;
  onSelect: (pricingOption: SubscriptionPricingOption) => void;
}

export const PricingOptionsSelectSection: React.FC<Props> = ({
  pricingOptions,
  selectedPricingOption,
  onSelect,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <BaseDetailSection>
      <Typography.Text type='secondary'>{t('subscription.pleaseSelectAPricingOption')}</Typography.Text>

      <Flex
        gap={theme.custom.spacing.small}
        style={{
          width: '100%',
          overflowX: 'auto',
          paddingBottom: theme.custom.spacing.medium,
        }}
      >
        {pricingOptions.map((pricingOption) => (
          <PricingOptionsSelectSectionItem
            key={pricingOption.id}
            pricingOption={pricingOption}
            selected={selectedPricingOption?.id === pricingOption.id}
            onSelect={() => onSelect(pricingOption)}
          />
        ))}
      </Flex>
    </BaseDetailSection>
  );
};
