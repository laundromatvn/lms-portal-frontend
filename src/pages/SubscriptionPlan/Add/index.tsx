import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Flex,
  Button,
  Form,
  Steps,
  type FormInstance,
  notification,
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import {
  useCreateSubscriptionPlanApi,
  type CreateSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useCreateSubscriptionPlanApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { BasicInformation } from './components/BasicInformation';
import { PricingConfiguration } from './components/PricingConfiguration';
import { PermissionGroup } from './components/PermissionGroup';

export const SubscriptionPlanAddPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const {
    createSubscriptionPlan,
    data: createSubscriptionPlanData,
    error: createSubscriptionPlanError,
  } = useCreateSubscriptionPlanApi<CreateSubscriptionPlanResponse>();

  const handleChange = (values: any) => {
    form.setFieldsValue(values);
  };

  const handleSave = (form: FormInstance) => {
    createSubscriptionPlan({
      name: form.getFieldValue('name'),
      description: form.getFieldValue('description'),
      price: form.getFieldValue('price'),
      type: form.getFieldValue('type'),
      interval: form.getFieldValue('interval'),
      interval_count: form.getFieldValue('interval_count'),
      trial_period_count: form.getFieldValue('trial_period_count'),
      permission_group_id: form.getFieldValue('permission_group_id'),
    });
  };

  useEffect(() => {
    if (createSubscriptionPlanData) {
      api.success({
        message: t('subscription.messages.addSubscriptionPlanSuccess'),
      });

      const timer = setTimeout(() => {
        navigate("/subscription-plans");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [createSubscriptionPlanData]);

  useEffect(() => {
    if (createSubscriptionPlanError) {
      api.error({
        message: t('subscription.messages.addSubscriptionPlanError'),
      });
    }
  }, [createSubscriptionPlanError]);

  return (
    <PortalLayoutV2
      title={t('subscription.plans')}
      onBack={() => navigate("/subscription-plans")}
    >
      {contextHolder}

      <Flex
        justify="end"
        gap={theme.custom.spacing.medium}
        style={{
          width: '100%',
          marginTop: theme.custom.spacing.medium,
        }}
      >
        <Button
          icon={<PlusOutlined />}
          onClick={() => handleSave(form)}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        >
          {t('common.save')}
        </Button>
      </Flex>

      <Flex
        vertical={true}
        gap={theme.custom.spacing.medium}
        style={{
          width: '100%',
          height: '100%',
          marginTop: theme.custom.spacing.medium,
        }}
      >
        <BasicInformation form={form} onChange={handleChange} />

        <PricingConfiguration form={form} onChange={handleChange} />

        <PermissionGroup form={form} onChange={handleChange} />
      </Flex>
    </PortalLayoutV2>
  );
};
