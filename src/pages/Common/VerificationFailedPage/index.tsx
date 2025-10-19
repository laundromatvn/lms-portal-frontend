import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { CenteredLayout } from '@shared/components/layouts/CenteredLayout';

import { VerificationMessage } from '../components/VerificationMessage';

export const VerificationFailedPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect_to') as string;

  const handleRedirectTo = () => {
    if (redirectTo) {
      navigate(redirectTo);
    } else {
      navigate('/auth/sign-in');
    }
  };

  return (
    <CenteredLayout>
      <VerificationMessage
        title={t('messages.verificationFailed')}
        description={t('messages.verificationFailedDescription')}
        type="error"
      />

      <Button
        type="primary"
        size="large"
        style={{
          minWidth: 128,
          borderRadius: theme.custom.radius.full,
          padding: theme.custom.spacing.medium,
        }}
        onClick={handleRedirectTo}
      >
        {t('common.goToSignInPage')}
      </Button>
    </CenteredLayout>
  );
};
