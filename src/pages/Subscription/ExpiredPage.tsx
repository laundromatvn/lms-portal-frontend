import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Typography, Flex } from 'antd';

import { AlarmTurnOff } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { CenteredLayout } from '@shared/components/layouts/CenteredLayout';
import { Logo } from '@shared/components/common/Logo';
import { Box } from '@shared/components/Box';

const { Title, Paragraph } = Typography;

/**
 * ExpiredPage - Placeholder page shown when subscription has expired
 * 
 * This page is displayed when:
 * - should_block_access === true
 * - is_trial === false (or not set)
 */
export const ExpiredPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <CenteredLayout>
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
        </Button>
      </Box>
    </CenteredLayout>
  );
};
