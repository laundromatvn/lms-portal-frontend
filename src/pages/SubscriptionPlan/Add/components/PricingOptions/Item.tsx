import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Flex,
  Form,
  InputNumber,
  Select,
  Switch,
} from 'antd';

import { TrashBinTrash } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';
import { SubscriptionPricingUnitEnum } from '@shared/enums/SubscriptionPricingUnitEnum';
import { SubscriptionPricingIntervalEnum } from '@shared/enums/SubscriptionPricingIntervalEnum';

import type { SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';

import { Box } from '@shared/components/Box';

interface Props {
  option: SubscriptionPricingOption;
  onChange: (values: SubscriptionPricingOption) => void;
  onDelete: () => void;
}

export const PricingOptionItem: React.FC<Props> = ({ option, onChange, onDelete }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm<SubscriptionPricingOption>();

  const handleOnChange = () => {
    const newValues = form.getFieldsValue();

    if (newValues.billing_type === SubscriptionPricingBillingTypEnum.ONE_TIME) {
      newValues.interval_count = undefined;
      newValues.billing_interval = undefined;
    }

    onChange(newValues);
  };

  useEffect(() => {
    form.setFieldsValue({
      is_enabled: option.is_enabled,
      is_default: option.is_default,
      billing_type: option.billing_type,
      pricing_unit: option.pricing_unit,
      interval_count: option.interval_count,
      billing_interval: option.billing_interval,
      base_unit_price: option.base_unit_price,
      trial_period_days: option.trial_period_days,
    });
  }, []);

  return (
    <Box
      vertical
      border
      style={{
        width: '100%',
        border: `2px dashed ${theme.custom.colors.neutral[200]}`,
      }}
    >
      <Flex justify="end" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        <Button
          danger
          onClick={onDelete}
          style={{ backgroundColor: theme.custom.colors.background.light }}
          icon={<TrashBinTrash />}
        >
          {t('common.delete')}
        </Button>
      </Flex>

      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%' }}
        onValuesChange={handleOnChange}
      >
        <Flex gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Form.Item
            label={t('subscription.isDefaultPricingOption')}
            name="is_default"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label={t('subscription.isEnabledPricingOption')}
            name="is_enabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Flex>

        <Flex gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Form.Item
            label={t('subscription.billingType')}
            name="billing_type"
            rules={[{ required: true, message: t('subscription.billingTypeIsRequired') }]}
            style={{ width: '100%' }}
          >
            <Select
              size="large"
              options={[
                { label: t('subscription.billingTypes.RECURRING'), value: SubscriptionPricingBillingTypEnum.RECURRING },
                { label: t('subscription.billingTypes.ONE_TIME'), value: SubscriptionPricingBillingTypEnum.ONE_TIME },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t('subscription.pricingUnit')}
            name="pricing_unit"
            rules={[{ required: true, message: t('subscription.pricingUnitIsRequired') }]}
            style={{ width: '100%' }}
          >
            <Select
              size="large"
              options={[
                { label: t('subscription.pricingUnits.MACHINE'), value: SubscriptionPricingUnitEnum.MACHINE },
                { label: t('subscription.pricingUnits.PLAN'), value: SubscriptionPricingUnitEnum.PLAN },
              ]}
            />
          </Form.Item>
        </Flex>

        <Flex gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Form.Item
            label={t('subscription.baseUnitPrice')}
            name="base_unit_price"
            rules={[{ required: true, message: t('subscription.baseUnitPriceIsRequired') }]}
            style={{ width: '100%' }}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              addonAfter={'đ'}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => {
                const cleaned = value?.replace(/,/g, '') || '';
                return (cleaned === '' ? 0 : Number(cleaned)) as 0;
              }}
              min={0}
              max={1000000000}
              step={1000}
            />
          </Form.Item>

          <Form.Item
            label={t('subscription.trialPeriodDays')}
            name="trial_period_days"
            rules={[{ required: true, message: t('subscription.trialPeriodDaysIsRequired') }]}
            style={{ width: '100%' }}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
        </Flex>

        {option.billing_type === SubscriptionPricingBillingTypEnum.RECURRING && (
          <>
            <Flex gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
              <Form.Item
                label={t('subscription.intervalCount')}
                name="interval_count"
                rules={[{ required: true, message: t('subscription.intervalCountIsRequired') }]}
                style={{ width: '100%' }}
              >
                <InputNumber
                  size="large"
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>

              <Form.Item
                label={t('subscription.billingInterval')}
                name="billing_interval"
                rules={[{ required: true, message: t('subscription.billingIntervalIsRequired') }]}
                style={{ width: '100%' }}
              >
                <Select
                  size="large"
                  options={[
                    { label: t('subscription.billingIntervals.MONTH'), value: SubscriptionPricingIntervalEnum.MONTH },
                    { label: t('subscription.billingIntervals.YEAR'), value: SubscriptionPricingIntervalEnum.YEAR },
                  ]}
                />
              </Form.Item>
            </Flex>
          </>
        )}
      </Form>
    </Box>
  );
};
