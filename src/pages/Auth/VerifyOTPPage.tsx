import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Typography, Divider, notification, Input, Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { useVerifyOTPApi } from '@shared/hooks/useVerifyOTPApi';
import { useGetLMSProfileApi } from '@shared/hooks/useGetLMSProfile';
import { useGetMeApi } from '@shared/hooks/useGetMe';
import { userStorage } from '@core/storage/userStorage';
import { tenantStorage } from '@core/storage/tenantStorage';
import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

import { AuthContainer } from './components';


export const VerifyOTPPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') as string;

  const {
    verifyOTP,
    loading: verifyOTPLoading,
    data: verifyOTPData,
    error: verifyOTPError,
  } = useVerifyOTPApi();
  const {
    getLMSProfile,
    loading: getLMSProfileLoading,
    data: getLMSProfileData,
    error: getLMSProfileError,
  } = useGetLMSProfileApi();
  const {
    getMe,
    loading: getMeLoading,
    data: getMeData,
    error: getMeError,
  } = useGetMeApi();

  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (verifyOTPData) {
      // First get user info to check if they are admin
      getMe();
    }
  }, [verifyOTPData]);

  useEffect(() => {
    if (getLMSProfileData) {
      userStorage.save(getLMSProfileData.user);
      tenantStorage.save(getLMSProfileData.tenant);
      navigate('/overview');
    }
  }, [getLMSProfileData]);

  useEffect(() => {
    if (getMeData) {
      userStorage.save(getMeData);
      if (getMeData.role === UserRoleEnum.ADMIN) {
        navigate('/overview');
      } else {
        getLMSProfile();
      }
    }
  }, [getMeData]);

  useEffect(() => {
    if (verifyOTPError) {
      api.error({
        message: t('messages.verifyOTPFailed'),
      });
    }
  }, [verifyOTPError]);

  useEffect(() => {
    if (getLMSProfileError) {
      api.error({
        message: t('auth.getLMSProfileFailed'),
      });
      setTimeout(() => {
        navigate('/auth/sign-in');
      }, 3000);
    }
  }, [getLMSProfileError]);

  useEffect(() => {
    if (getMeError) {
      api.error({
        message: t('auth.getMeFailed'),
      });
      setTimeout(() => {
        navigate('/auth/sign-in');
      }, 3000);
    }
  }, [getMeError]);

  return (
    <AuthContainer>
      {contextHolder}

      <Typography.Title level={2}>{t('auth.OTPVerification')}</Typography.Title>
      <Typography.Text>{t('auth.verifyOTPDescription')}</Typography.Text>

      <Divider />

      <Flex vertical justify="center" align="center" gap={theme.custom.spacing.small} style={{ height: 200 }}>
        <Input.OTP
          length={6}
          value={otp}
          onChange={(val) => setOtp(val.replace(/\D/g, ''))}
          disabled={verifyOTPLoading || getLMSProfileLoading || getMeLoading}
          size="large"
          style={{ width: '100%' }}
        />
      </Flex>

      <Button
        type="primary"
        size="large"
        onClick={() => verifyOTP({ otp, sessionId })}
        loading={verifyOTPLoading || getLMSProfileLoading || getMeLoading}
        disabled={otp.length !== 6}
        style={{
          width: '100%',
          borderRadius: theme.custom.radius.full,
          padding: theme.custom.spacing.medium,
        }}
      >
        {t('auth.verifyOTP')}
      </Button>
    </AuthContainer>
  );
};
