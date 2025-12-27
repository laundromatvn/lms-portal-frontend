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

import { SubscriptionPlanSection } from './SubscriptionPlanSection';

const TABS = {
  PLANS: 'plans',
}

export const SubscriptionPlanListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const segmentedOptions = [
    {
      label: t('subscription.plans'),
      value: TABS.PLANS,
    },
  ];

  const [selectedTab, setSelectedTab] = useState<string>(TABS.PLANS);

  return (
    <PortalLayoutV2
      title={t('subscription.plans')}
      onBack={() => navigate(-1)}
    >
      <Flex style={{ 
        width: '100%',
        justifyContent: isMobile ? 'flex-end' : 'flex-start',
      }}>
        <Segmented
          options={segmentedOptions}
          value={selectedTab}
          onChange={(value) => setSelectedTab(value)}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            padding: theme.custom.spacing.xsmall,
            paddingBottom: theme.custom.spacing.small,
            overflowX: 'auto',
          }}
        />
      </Flex>

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', marginTop: theme.custom.spacing.medium }}
      >
        {selectedTab === TABS.PLANS && (
          <SubscriptionPlanSection />
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
