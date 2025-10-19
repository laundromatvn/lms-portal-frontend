import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Typography, Divider, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { useGenerateEmailOTPApi } from '@shared/hooks/useGenerateEmailOTPApi';

import { OTPActionEnum } from '@shared/enums/OTPActionEnum';

import { AuthContainer } from './components';

export const GenerateOTPPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') as string;
  const redirectTo = searchParams.get('redirect_to') as string;
  const action = searchParams.get('action') as OTPActionEnum;

  const { generateEmailOTP, loading, data, error } = useGenerateEmailOTPApi();

  useEffect(() => {
    if (data) {
      const queryParams = new URLSearchParams();
      if (sessionId) {
        queryParams.set('session_id', sessionId);
      }
      if (redirectTo) {
        queryParams.set('redirect_to', redirectTo);
      }
      if (action) {
        queryParams.set('action', action);
      }

      const queryString = queryParams.toString();
      navigate(`/auth/verify-otp${queryString ? `?${queryString}` : ''}`);
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
        onClick={() => generateEmailOTP({ action: OTPActionEnum.SIGN_IN })}
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
