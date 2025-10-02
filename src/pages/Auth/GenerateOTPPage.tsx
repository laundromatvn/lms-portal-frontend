import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Typography, Divider, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { useGenerateEmailOTPApi } from '@shared/hooks/useGenerateEmailOTPApi';

import { AuthContainer } from './components';


export const GenerateOTPPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const { generateEmailOTP, loading, data, error } = useGenerateEmailOTPApi();

  useEffect(() => {
    if (data) {
      navigate('/auth/verify-otp');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      api.error({
        message: t('messages.generateOTPFailed'),
      });
      navigate('/auth/sign-in');
    }
  }, [error]);

  return (
    <AuthContainer>
      {contextHolder}

      <Typography.Title level={2}>{t('auth.OTPVerification')}</Typography.Title>
      <Typography.Text>{t('auth.generateOTPDescription')}</Typography.Text>

      <Divider />

      <Button
        type="primary"
        size="large"
        onClick={generateEmailOTP}
        loading={loading}
        style={{
          width: '100%',
          borderRadius: theme.custom.radius.full,
          padding: theme.custom.spacing.medium,
        }}
      >
        {t('auth.sendOTP')}
      </Button>
    </AuthContainer>
  );
};
