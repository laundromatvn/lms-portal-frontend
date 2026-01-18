import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { CenteredLayout } from '@shared/components/layouts/CenteredLayout';
import { Logo } from '@shared/components/common/Logo';

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
      <Logo size="large" />
      
      <Title level={2} style={{ textAlign: 'center', marginTop: theme.custom.spacing.large }}>
        Subscription Expired
      </Title>
      
      <Paragraph style={{ textAlign: 'center', maxWidth: 500 }}>
        Your subscription has expired. Please renew your subscription to continue using the portal.
      </Paragraph>

      <Button
        type="primary"
        size="large"
        style={{
          minWidth: 200,
          borderRadius: theme.custom.radius.full,
          padding: theme.custom.spacing.medium,
        }}
        onClick={() => navigate('/subscription/renew')}
      >
        Renew Subscription
      </Button>
    </CenteredLayout>
  );
};
