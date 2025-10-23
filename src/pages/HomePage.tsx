import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { tokenManager } from '@core/auth/tokenManager';

import { Logo } from '@shared/components/common/Logo';
import { CenteredLayout } from '@shared/components/layouts/CenteredLayout';

export const HomePage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    if (tokenManager.isAuthenticated()) {
      navigate('/overview');
    }
  }, [navigate]);

  return (
    <CenteredLayout>
        <Logo size="xlarge" />

        <Button
          type="primary"
          size="large"
          style={{
            minWidth: 128,
            borderRadius: theme.custom.radius.full,
            padding: theme.custom.spacing.medium,
          }}
          onClick={() => navigate('/auth/sign-in')}
        >
          {t('common.signIn')}
        </Button>
    </CenteredLayout>
  );
};
