import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Typography, Form, Input, Divider, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { useSignInApi } from '@shared/hooks/useSignInApi';
import { tokenManager, type TokenBundle } from '@core/auth/tokenManager';
import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS } from '@core/constant'

import { AuthContainer } from './components';


export const SignInPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const { signIn, loading, data, error } = useSignInApi();
  
  const handleSubmit = async () => {
    await signIn({
      email: form.getFieldValue('email'),
      password: form.getFieldValue('password'),
    });
  };

  useEffect(() => {
    if (data) {
      try {
        const bundle: TokenBundle = {
          accessToken: (data as any).access_token,
          refreshToken: (data as any).refresh_token,
          accessTokenExp: Date.now() + ACCESS_TOKEN_TTL_SECONDS * 1000,
          refreshTokenExp: Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000,
        }
        tokenManager.setTokens(bundle)
      } catch {}
      api.success({
        message: t('messages.signInSuccess'),
      });

      navigate('/auth/generate-otp');
    } 
  }, [data])

  useEffect(() => {
    if (error) {
      api.error({
        message: t('messages.incorrectCredentials'),
      });
    }
  }, [error])

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
            loading={loading}
          >
            {t('common.signIn')}
          </Button>
        </Form.Item>
      </Form>
    </AuthContainer>
  );
};
