import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { CenteredLayout } from '@shared/components/layouts/CenteredLayout';
import { Logo } from '@shared/components/common/Logo';

const { Title, Paragraph } = Typography;

/**
 * TrialEndedPage - Placeholder page shown when trial period has ended
 * 
 * This page is displayed when:
 * - should_block_access === true
 * - is_trial === true
 */
export const TrialEndedPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <CenteredLayout>
      <Logo size="large" />
      
      <Title level={2} style={{ textAlign: 'center', marginTop: theme.custom.spacing.large }}>
        Trial Period Ended
      </Title>
      
      <Paragraph style={{ textAlign: 'center', maxWidth: 500 }}>
        Your trial period has ended. Please subscribe to continue using the portal.
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
        Subscribe Now
      </Button>
    </CenteredLayout>
  );
};
