import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Drawer,
  Flex,
  Form,
  InputNumber,
  Select,
  Switch,
  Button,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import type { SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';
import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';
import { SubscriptionPricingIntervalEnum } from '@shared/enums/SubscriptionPricingIntervalEnum';
import { SubscriptionPricingUnitEnum } from '@shared/enums/SubscriptionPricingUnitEnum';

interface Props {
  pricingOption?: SubscriptionPricingOption;
  open: boolean;
  onClose: () => void;
  onSave: (pricingOption: SubscriptionPricingOption) => void;
}

export const OptionDrawer: React.FC<Props> = ({
  pricingOption,
  open,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [form] = Form.useForm<SubscriptionPricingOption>();

  const [billingType, setBillingType] = useState<SubscriptionPricingBillingTypEnum>(SubscriptionPricingBillingTypEnum.RECURRING);

  const handleSave = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    onSave({
      id: pricingOption?.id || undefined,
      is_enabled: values.is_enabled,
      is_default: values.is_default,
      billing_type: values.billing_type,
      pricing_unit: values.pricing_unit,
      interval_count: values.interval_count,
      billing_interval: values.billing_interval,
      base_unit_price: values.base_unit_price,
      trial_period_days: values.trial_period_days,
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      id: pricingOption?.id || undefined,
      is_enabled: pricingOption?.is_enabled,
      is_default: pricingOption?.is_default,
      billing_type: pricingOption?.billing_type || SubscriptionPricingBillingTypEnum.RECURRING,
      pricing_unit: pricingOption?.pricing_unit || SubscriptionPricingUnitEnum.MACHINE,
      interval_count: pricingOption?.interval_count || 1,
      billing_interval: pricingOption?.billing_interval || SubscriptionPricingIntervalEnum.MONTH,
      base_unit_price: pricingOption?.base_unit_price || 0,
      trial_period_days: pricingOption?.trial_period_days || 0,
    });

    setBillingType(pricingOption?.billing_type || SubscriptionPricingBillingTypEnum.RECURRING);
  }, [pricingOption]);

  return (
    <Drawer
      title={t('subscription.pricingOption')}
      open={open}
      onClose={onClose}
      width={isMobile ? '100%' : 600}
      style={{
        backgroundColor: theme.custom.colors.background.light,
      }}
      footer={(
        <Flex justify="space-between" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Button
            size="large"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={handleSave}
            style={{ width: '100%' }}
          >
            {t('common.save')}
          </Button>
        </Flex>
      )}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%' }}
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
            onChange={(value) => {
              if (value === SubscriptionPricingBillingTypEnum.ONE_TIME) {
                form.setFieldsValue({
                  interval_count: undefined,
                  billing_interval: undefined,
                });
              } else {
                form.setFieldsValue({
                  interval_count: 1,
                  billing_interval: SubscriptionPricingIntervalEnum.MONTH,
                });
              }

              setBillingType(value as SubscriptionPricingBillingTypEnum);
            }}
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
              { label: t('subscription.pricingUnits.STORE'), value: SubscriptionPricingUnitEnum.STORE },
              { label: t('subscription.pricingUnits.PLAN'), value: SubscriptionPricingUnitEnum.PLAN },
            ]}
          />
        </Form.Item>

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

        {billingType === SubscriptionPricingBillingTypEnum.RECURRING && (
          <>
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
          </>
        )}
      </Form>
    </Drawer>
  );
};
