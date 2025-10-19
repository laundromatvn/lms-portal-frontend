import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Typography, Form, Input, Divider, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  tokenManager,
  type TokenBundle,
} from '@core/auth/tokenManager';

import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS } from '@core/constant'

import { useSignInApi } from '@shared/hooks/useSignInApi';
import { useProceedAuthSessionApi } from '@shared/hooks/useProceedAuthSessionApi';

import { OTPActionEnum } from '@shared/enums/OTPActionEnum';

import { AuthContainer } from './components';

export const SignInPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') as string;
  const redirectTo = searchParams.get('redirect_to') as string;
  const action = searchParams.get('action') as OTPActionEnum;

  const {
    signIn,
    loading: signInLoading,
    data: signInData,
    error: signInError,
  } = useSignInApi();
  const {
    proceedAuthSession,
  } = useProceedAuthSessionApi();

  const handleSubmit = async () => {
    await signIn({
      email: form.getFieldValue('email'),
      password: form.getFieldValue('password'),
      sessionId: sessionId,
    });
  };

  useEffect(() => {
    if (sessionId) {
      console.log('sessionId', sessionId)
      proceedAuthSession({ sessionId: sessionId });
    }
  }, [sessionId]);

  useEffect(() => {
    if (signInData) {
      try {
        const bundle: TokenBundle = {
          accessToken: (signInData as any).access_token,
          refreshToken: (signInData as any).refresh_token,
          accessTokenExp: Date.now() + ACCESS_TOKEN_TTL_SECONDS * 1000,
          refreshTokenExp: Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000,
        }
        tokenManager.setTokens(bundle)
      } catch {}
      api.success({
        message: t('messages.signInSuccess'),
      });

      const queryParams = new URLSearchParams();
      if (sessionId) {
        queryParams.set('session_id', sessionId);
      }
      if (redirectTo) {
        queryParams.set('redirect_to', redirectTo);
      }
      if (action) {
        queryParams.set('action', action);
      } else {
        queryParams.set('action', OTPActionEnum.SIGN_IN);
      }

      const queryString = queryParams.toString();
      navigate(`/auth/generate-otp${queryString ? `?${queryString}` : ''}`);
    } 
  }, [signInData])

  useEffect(() => {
    if (signInError) {
      api.error({
        message: t('messages.incorrectCredentials'),
      });
    }
  }, [signInError])

  return (
    <AuthContainer>
      {contextHolder}
      <Typography.Title level={2}>{t('common.signIn')}</Typography.Title>
      <Divider />
      <Form form={form}>
        <Form.Item label={t('common.email')} name="email" labelCol={{ span: 24 }}>
          <Input size="large" />
        </Form.Item>

        <Form.Item label={t('common.password')} name="password" labelCol={{ span: 24 }}>
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item labelCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ width: '100%', borderRadius: theme.custom.radius.full }}
            onClick={handleSubmit}
            loading={signInLoading}
          >
            {t('common.signIn')}
          </Button>
        </Form.Item>
      </Form>
    </AuthContainer>
  );
};
