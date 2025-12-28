import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex } from 'antd';

import { Star } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type Tenant } from '@shared/types/tenant';

import { SubscriptionPlanSection } from './SubscriptionPlanSection';
import { PermissionsSection } from './PermissionsSection';

interface Props {
  tenant: Tenant;
}

export const SubscriptionPlanTab: React.FC<Props> = ({ tenant }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Flex
      vertical
      gap={theme.custom.spacing.medium}
      style={{ width: '100%' }}
    >
      <Flex justify="flex-end" style={{ width: '100%' }}>
        <Button
          icon={<Star />}
          onClick={() => navigate(`/tenants/${tenant.id}/subscription-plan`)}
          style={{
            backgroundColor: theme.custom.colors.background.dark,
            color: theme.custom.colors.text.inverted,
            borderColor: theme.custom.colors.background.dark,
          }}
        >
          {t('subscription.upgrade')}
        </Button> 
      </Flex>

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%' }}
      >
        <SubscriptionPlanSection tenant={tenant} />
        <PermissionsSection tenant={tenant} />
      </Flex>
    </Flex>
  );
};
