import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Form,
  Flex,
  Button,
  notification,
  type FormInstance,
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import {
  useGetSubscriptionPlanApi,
  type GetSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useGetSubscriptionPlanApi';
import {
  useUpdateSubscriptionPlanApi,
  type UpdateSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useUpdateSubscriptionPlanApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { BasicInformationEditSection } from './components/BasicInformationEditSection';
import { PermissionGroupEditSection } from './components/PermissionGroupEditSection';

export const SubscriptionPlanEditPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const subscriptionPlanId = useParams().id as string;

  const [form] = Form.useForm();

  const {
    getSubscriptionPlan,
    data: subscriptionPlanData,
  } = useGetSubscriptionPlanApi<GetSubscriptionPlanResponse>();
  const {
    updateSubscriptionPlan,
    data: updateSubscriptionPlanData,
    error: updateSubscriptionPlanError,
  } = useUpdateSubscriptionPlanApi<UpdateSubscriptionPlanResponse>();

  const handleSave = async (form: FormInstance) => {
    await form.validateFields();

    updateSubscriptionPlan(subscriptionPlanId, {
      name: form.getFieldValue('name'),
      description: form.getFieldValue('description'),
      is_enabled: form.getFieldValue('is_enabled'),
      permission_group_id: form.getFieldValue('permission_group_id') || undefined,
    });
  };

  useEffect(() => {
    if (!subscriptionPlanData) return;

    form.setFieldsValue({
      name: subscriptionPlanData.name,
      description: subscriptionPlanData.description,
      is_enabled: subscriptionPlanData.is_enabled,
      permission_group_id: subscriptionPlanData.permission_group?.id || undefined,
    });
  }, [subscriptionPlanData]);

  useEffect(() => {
    if (updateSubscriptionPlanError) {
      api.error({
        message: t('subscription.messages.updateSubscriptionPlanError'),
      });
    }
  }, [updateSubscriptionPlanError]);

  useEffect(() => {
    if (updateSubscriptionPlanData) {
      api.success({
        message: t('subscription.messages.updateSubscriptionPlanSuccess'),
      });

      const timer = setTimeout(() => {
        navigate(`/subscription-plans/${subscriptionPlanId}/detail`);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [updateSubscriptionPlanData]);

  useEffect(() => {
    if (subscriptionPlanId) {
      getSubscriptionPlan(subscriptionPlanId);
    }
  }, [subscriptionPlanId]);

  return (
    <PortalLayoutV2 title={t('subscription.plans')} onBack={() => navigate(-1)}>
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

      {subscriptionPlanData && (
        <Flex
          vertical
          gap={theme.custom.spacing.medium}
          style={{
            width: '100%',
            marginTop: theme.custom.spacing.medium,
          }}
        >
          <BasicInformationEditSection
            form={form}
            onChange={handleSave}
          />

          <PermissionGroupEditSection
            form={form}
            onChange={handleSave}
          />
        </Flex>
      )}
    </PortalLayoutV2>
  );
};
