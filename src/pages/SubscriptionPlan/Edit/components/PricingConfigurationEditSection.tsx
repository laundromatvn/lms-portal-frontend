import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Form,
  InputNumber,
  Select,
  type FormInstance,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { SubscriptionPlanTypeEnum } from '@shared/enums/SubscriptionPlanTypeEnum';
import { SubscriptionPlanIntervalEnum } from '@shared/enums/SubscriptionPlanIntervalEnum';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  form: FormInstance<any>;
  onChange: (values: any) => void;
}

export const PricingConfigurationEditSection: React.FC<Props> = ({ form, onChange }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <BaseEditSection title={t('subscriptionPlan.pricingConfiguration')}>
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%', maxWidth: 600 }}
        onValuesChange={(_, values) => onChange(values)}
      >
        <Form.Item
          label={t('common.price')}
          name="price"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.priceIsRequired') }]}
        >
          <InputNumber
            size="large"
            style={{
              width: '100%',
              backgroundColor: theme.custom.colors.background.light,
            }}
            defaultValue={form.getFieldValue('price') || 0}
            addonAfter={'đ'}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => {
              const cleaned = value?.replace(/,/g, '') || '';
              return (cleaned === '' ? 0 : Number(cleaned)) as 0;
            }}
          />
        </Form.Item>

        <Form.Item
          label={t('common.type')}
          name="type"
          style={{ width: '100%' }}
        >
          <Select
            size="large"
            style={{
              width: '100%',
              backgroundColor: theme.custom.colors.background.light,
            }}
            defaultValue={SubscriptionPlanTypeEnum.RECURRING}
            options={[
              { label: t('subscriptionPlan.recurring'), value: SubscriptionPlanTypeEnum.RECURRING },
              // { label: t('subscriptionPlan.oneTime'), value: SubscriptionPlanTypeEnum.ONE_TIME },
            ]}
          >
            {Object.values(SubscriptionPlanTypeEnum).map((type) => (
              <Select.Option key={type} value={type}>
                {t(`subscriptionPlan.${type.toLowerCase()}`)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Flex gap={theme.custom.spacing.small} style={{ width: '100%' }}>
          <Flex vertical gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
            <Form.Item
              label={t('subscriptionPlan.intervalCount')}
              name="interval_count"
              style={{ width: '100%' }}
            >
              <InputNumber
                size="large"
                defaultValue={1}
                style={{
                  width: '100%',
                  backgroundColor: theme.custom.colors.background.light,
                }}
              />
            </Form.Item>

            <Form.Item
              label={t('subscriptionPlan.trialPeriodCount')}
              name="trial_period_count"
              style={{ width: '100%' }}
            >
              <InputNumber
                size="large"
                defaultValue={1}
                style={{
                  width: '100%',
                  backgroundColor: theme.custom.colors.background.light,
                }}
              />
            </Form.Item>
          </Flex>

          <Form.Item
            label={t('subscriptionPlan.interval')}
            name="interval"
            style={{ width: '100%' }}
          >
            <Select
              size="large"
              defaultValue={SubscriptionPlanIntervalEnum.MONTH}
              options={[
                { label: t('subscriptionPlan.month'), value: SubscriptionPlanIntervalEnum.MONTH },
                { label: t('subscriptionPlan.year'), value: SubscriptionPlanIntervalEnum.YEAR },
              ]}
              style={{
                width: '100%',
                backgroundColor: theme.custom.colors.background.light,
              }}
            >
              {Object.values(SubscriptionPlanIntervalEnum).map((interval) => (
                <Select.Option key={interval} value={interval}>
                  {t(`subscriptionPlan.${interval.toLowerCase()}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Flex>
      </Form>
    </BaseEditSection>
  );
};
