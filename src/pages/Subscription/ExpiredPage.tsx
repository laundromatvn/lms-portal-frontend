import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Typography, Flex } from 'antd';

import {
  AlarmTurnOff,
  Home,
  ArrowRight,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { userStorage } from '@core/storage/userStorage';
import { tenantStorage } from '@core/storage/tenantStorage';
import { tokenStorage } from '@core/storage/tokenStorage';

import { CenteredLayout } from '@shared/components/layouts/CenteredLayout';
import { Logo } from '@shared/components/common/Logo';
import { Box } from '@shared/components/Box';

const { Title, Paragraph } = Typography;

export const ExpiredPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <CenteredLayout style={{ maxWidth: 600 }}>
      <Logo size="large" style={{ backgroundColor: 'transparent' }} />

      <Box
        vertical
        border
        justify="center"
        align="center"
        gap={theme.custom.spacing.medium}
        style={{
          width: '100%',
          maxWidth: 600,
          backgroundColor: theme.custom.colors.danger.light,
          boxShadow: theme.custom.shadows.small,
          borderColor: theme.custom.colors.danger.light,
          borderRadius: theme.custom.radius.medium,
          padding: theme.custom.spacing.medium,
        }}
      >
        <AlarmTurnOff
          size={64}
          weight='BoldDuotone'
          style={{ color: theme.custom.colors.danger.default }}
        />

        <Flex vertical justify="center" align="center" gap={theme.custom.spacing.xsmall}>
          <Title level={2} style={{ color: theme.custom.colors.danger.default }}>
            {t('subscriptionGuard.subscriptionExpired')}
          </Title>
          <Paragraph type="secondary">
            {t('subscriptionGuard.subscriptionExpiredDescription')}
          </Paragraph>
        </Flex>

        <Button
          type="primary"
          size="large"
          onClick={() => navigate('/subscription/renew')}
          style={{
            width: '100%',
            fontWeight: theme.custom.fontWeight.large,
            border: 'none',
            padding: theme.custom.spacing.medium,
            backgroundColor: theme.custom.colors.danger.default,
          }}
        >
          {t('subscriptionGuard.renewSubscription')}
          <ArrowRight />
        </Button>
      </Box>

      <Button
        type="primary"
        size="large"
        onClick={() => navigate('/overview')}
        style={{
          width: '100%',
          fontWeight: theme.custom.fontWeight.large,
          border: 'none',
          padding: theme.custom.spacing.medium,
        }}
      >
        {t('subscriptionGuard.goToHomePage')}
        <Home />
      </Button>

      <Button
        type="link"
        size="large"
        onClick={() => {
          userStorage.clear();
          tenantStorage.clear();
          tokenStorage.clear();
          navigate('/auth/sign-in');
        }}
      >
        {t('common.logout')}
      </Button>
    </CenteredLayout>
  );
};
