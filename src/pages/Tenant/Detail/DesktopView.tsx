import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Flex,
  Segmented,
  notification,
} from 'antd';

import {
  InfoCircle,
  UsersGroupTwoRounded,
  CheckSquare,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useGetTenantApi,
  type GetTenantResponse,
} from '@shared/hooks/tenant/useGetTenantApi';

import { type Tenant } from '@shared/types/tenant';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { InformationTab } from './components/InformationTab';
import { MemberTab } from './components/MemberTab';
import { SubscriptionPlanTab } from './components/SubscriptionPlanTab';

const TABS = {
  INFORMATION: 'information',
  MEMBERS: 'members',
  SUBSCRIPTION: 'subscription',
}

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const tenantId = useParams().id as string;

  const segmentedOptions = [
    {
      label: t('tenant.detail.information'),
      value: TABS.INFORMATION,
      icon: <InfoCircle />,
    },
    {
      label: t('tenant.detail.members'),
      value: TABS.MEMBERS,
      icon: <UsersGroupTwoRounded />,
    },
    {
      label: t('subscription.subscriptions'),
      value: TABS.SUBSCRIPTION,
      icon: <CheckSquare />,
    },
  ]

  const [selectedTab, setSelectedTab] = useState<string>(TABS.INFORMATION);

  const {
    getTenant,
    data: tenantData,
    error: tenantError,
  } = useGetTenantApi<GetTenantResponse>();

  useEffect(() => {
    if (tenantId) {
      getTenant(tenantId);
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantError) {
      api.error({
        message: t('tenant.messages.getTenantError'),
      });
    }
  }, [tenantError]);

  return (
    <PortalLayoutV2
      title={t('tenant.tenantDetail')}
      onBack={() => navigate('/tenants')}
    >
      {contextHolder}

      <Flex style={{ width: '100%' }}>
        <Segmented
          options={segmentedOptions}
          value={selectedTab}
          onChange={(value) => setSelectedTab(value)}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            padding: theme.custom.spacing.xxsmall,
          }}
        />
      </Flex>

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', marginTop: theme.custom.spacing.medium }}
      >
        {selectedTab === TABS.INFORMATION && <InformationTab tenant={tenantData as Tenant} />}
        {selectedTab === TABS.MEMBERS && <MemberTab tenant={tenantData as Tenant} />}
        {selectedTab === TABS.SUBSCRIPTION && <SubscriptionPlanTab tenant={tenantData as Tenant} />}
      </Flex>
    </PortalLayoutV2>
  );
};
