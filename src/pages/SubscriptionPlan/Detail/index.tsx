import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Flex,
  Segmented,
  Dropdown,
  Button,
  notification,
} from 'antd';

import {
  AltArrowDown,
  TrashBinTrash,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useGetSubscriptionPlanApi,
  type GetSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useGetSubscriptionPlanApi';
import {
  useDeleteSubscriptionPlanApi,
  type DeleteSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useDeleteSubscriptionPlanApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { BasicInformationTab } from './components/BasicInformationTab';
import { PermissionsTab } from './components/PermissionsTab';

const TABS = {
  BASIC_INFORMATION: 'basicInformation',
  PERMISSIONS: 'permissions',
}

export const SubscriptionPlanDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const subscriptionPlanId = useParams().id as string;

  const tabs = [
    {
      label: t('subscriptionPlan.basicInformation'),
      value: TABS.BASIC_INFORMATION,
    },
    {
      label: t('navigation.permissions'),
      value: TABS.PERMISSIONS,
    },
  ]

  const [selectedTab, setSelectedTab] = useState<string>(TABS.BASIC_INFORMATION);

  const {
    getSubscriptionPlan,
    data: subscriptionPlan,
    loading: subscriptionPlanLoading,
  } = useGetSubscriptionPlanApi<GetSubscriptionPlanResponse>();

  const {
    deleteSubscriptionPlan,
    data: deleteSubscriptionPlanData,
    error: deleteSubscriptionPlanError,
  } = useDeleteSubscriptionPlanApi<DeleteSubscriptionPlanResponse>();

  useEffect(() => {
    if (deleteSubscriptionPlanError) {
      api.error({
        message: t('subscriptionPlan.messages.deleteSubscriptionPlanError'),
      });
    }
  }, [deleteSubscriptionPlanError]);

  useEffect(() => {
    if (deleteSubscriptionPlanData) {
      api.success({
        message: t('subscriptionPlan.messages.deleteSubscriptionPlanSuccess'),
      });

      const timer = setTimeout(() => {
        navigate('/permissions');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [deleteSubscriptionPlanData]);

  useEffect(() => {
    if (subscriptionPlanId) {
      getSubscriptionPlan(subscriptionPlanId);
    }
  }, [subscriptionPlanId]);

  return (
    <PortalLayoutV2
      title={t('navigation.subscriptionPlans')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <Flex
        justify="space-between"
        gap={theme.custom.spacing.small}
        style={{ width: '100%' }}
      >
        <Segmented
          options={tabs}
          value={selectedTab}
          onChange={(value) => setSelectedTab(value)}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            padding: theme.custom.spacing.xsmall,
          }}
        />

        <Dropdown
          menu={{
            items: [
              {
                label: t('common.delete'),
                key: 'delete',
                icon: <TrashBinTrash />,
                style: { color: theme.custom.colors.danger.default },
                onClick: () => deleteSubscriptionPlan(subscriptionPlanId),
              },
            ],
          }}
        >
          <Button
            icon={<AltArrowDown />}
            style={{
              color: theme.custom.colors.neutral.default,
              backgroundColor: theme.custom.colors.background.light,
            }}
          >
            {t('common.actions')}
          </Button>
        </Dropdown>
      </Flex>

      <Flex
        vertical
        style={{
          width: '100%',
          marginTop: theme.custom.spacing.medium,
        }}
      >
        {selectedTab === TABS.BASIC_INFORMATION && (
          <BasicInformationTab
            subscriptionPlan={subscriptionPlan}
            loading={subscriptionPlanLoading}
          />
        )}

        {selectedTab === TABS.PERMISSIONS && (
          <PermissionsTab
            subscriptionPlan={subscriptionPlan}
            loading={subscriptionPlanLoading}
          />
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
