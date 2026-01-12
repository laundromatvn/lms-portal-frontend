import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Flex,
  type FormInstance,
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import { BaseEditSection } from '@shared/components/BaseEditSection';
import { Box } from '@shared/components/Box';

import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';
import { SubscriptionPricingUnitEnum } from '@shared/enums/SubscriptionPricingUnitEnum';
import { SubscriptionPricingIntervalEnum } from '@shared/enums/SubscriptionPricingIntervalEnum';
import type { SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';

import { PricingOptionItem } from './Item';

interface Props {
  form: FormInstance<any>;
  onChange: (values: any) => void;
}


export const PricingOptions: React.FC<Props> = ({ form, onChange }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [draftOptions, setDraftOptions] = useState<SubscriptionPricingOption[]>([]);

  const handleAddOption = () => {
    setDraftOptions([...draftOptions, {
      is_enabled: true,
      is_default: false,
      billing_type: SubscriptionPricingBillingTypEnum.RECURRING,
      pricing_unit: SubscriptionPricingUnitEnum.MACHINE,
      interval_count: 1,
      billing_interval: SubscriptionPricingIntervalEnum.MONTH,
      base_unit_price: 0,
      trial_period_days: 0,
    }]);
  };

  useEffect(() => {
    form.setFieldsValue({
      pricing_options: draftOptions,
    });
  }, [draftOptions]);

  return (
    <BaseEditSection title={t('subscription.pricingOptions')}>
      {draftOptions.length > 0 ? (
        <Flex
          justify="end"
          align="center"
          gap={theme.custom.spacing.medium}
          style={{
            width: '100%',
          }}
        >
          <Button
            type="primary"
            onClick={handleAddOption}
            icon={<PlusOutlined />}
          >
            {t('subscription.addOption')}
          </Button>
        </Flex>
      ) : (
        <Box
          vertical
          border
          style={{
            width: '100%',
            border: `2px dashed ${theme.custom.colors.neutral[200]}`,
          }}
        >
          <Button
            type="primary"
            size="large"
            onClick={handleAddOption}
            icon={<PlusOutlined />}
          >
            {t('subscription.addOption')}
          </Button>
        </Box>
      )}

      {draftOptions.map((option, index) => (
        <PricingOptionItem
          option={option}
          onChange={(values) => {
            setDraftOptions(draftOptions.map((o, i) => i === index ? values : o));
          }}
          onDelete={() => {
            setDraftOptions(draftOptions.filter((_, i) => i !== index));
          }}
        />
      ))}
    </BaseEditSection>
  );
};
