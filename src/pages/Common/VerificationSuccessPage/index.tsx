import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { CenteredLayout } from '@shared/components/layouts/CenteredLayout';

import { VerificationMessage } from '../components/VerificationMessage';

export const VerificationSuccessPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <CenteredLayout>
      <VerificationMessage
        title={t('messages.verificationSuccess')}
        description={t('messages.verificationSuccessDescription')}
        type="success"
      />

      <Button
        type="primary"
        size="large"
        onClick={() => navigate('/overview')}
      >
        {t('common.goToHomePage')}
      </Button>
    </CenteredLayout>
  );
};
