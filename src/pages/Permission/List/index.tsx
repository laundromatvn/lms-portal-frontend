import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Flex,
  Segmented,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { PermissionsSection } from './PermissionsSection';
import { GroupPermissionsSection } from './GroupPermissionsSection';
import { SubscriptionPlanSection } from './SubscriptionPlanSection';

const TABS = {
  PERMISSIONS: 'permissions',
  GROUP_PERMISSIONS: 'group_permissions',
  SUBSCRIPTION_PLANS: 'subscription_plans',
}

export const PermissionListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const segmentedOptions = [
    {
      label: t('navigation.subscriptionPlans'),
      value: TABS.SUBSCRIPTION_PLANS,
    },
    {
      label: t('navigation.groupPermissions'),
      value: TABS.GROUP_PERMISSIONS,
    },
    {
      label: t('navigation.permissions'),
      value: TABS.PERMISSIONS,
    },
  ];

  const [selectedTab, setSelectedTab] = useState<string>(TABS.SUBSCRIPTION_PLANS);

  return (
    <PortalLayoutV2
      title={t('navigation.permissionsAndSubscriptionPlans')}
      onBack={() => navigate(-1)}
    >
      <Flex justify={isMobile ? 'flex-end' : 'flex-start'}>
        <Segmented
          size="large"
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
        {selectedTab === TABS.GROUP_PERMISSIONS && (
          <GroupPermissionsSection />
        )}

        {selectedTab === TABS.PERMISSIONS && (
          <PermissionsSection />
        )}

        {selectedTab === TABS.SUBSCRIPTION_PLANS && (
          <SubscriptionPlanSection />
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
