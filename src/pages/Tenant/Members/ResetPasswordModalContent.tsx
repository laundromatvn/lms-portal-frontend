import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Input,
  Form,
  Typography,
  notification,
  Button,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useResetPasswordApi,
  type ResetPasswordResponse,
} from '@shared/hooks/useResetPasswordApi';

import { Box } from '@shared/components/Box';
import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  user_id: string;
  onClose: () => void;
}

export const ResetPasswordModalContent: React.FC<Props> = ({ user_id, onClose }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const {
    resetPassword,
    data: userData,
    loading: userLoading,
    error: userError,
  } = useResetPasswordApi<ResetPasswordResponse>();

  const handleResetPassword = async () => {
    try {
      await form.validateFields();
      const password = form.getFieldValue('password');
      resetPassword(user_id, { password });
    } catch (error) {
      return;
    }
  }

  useEffect(() => {
    if (userError) {
      api.error({
        message: t('messages.resetPasswordError'),
      });
    }
  }, [userError]);

  useEffect(() => {
    if (userData) {
      api.success({
        message: t('messages.resetPasswordSuccess'),
      });

      onClose?.();
    }
  }, [userData]);

  useEffect(() => {
    form.setFieldsValue({
      password: '',
      passwordConfirm: '',
    });
  }, []);

  return (
    <Flex vertical gap={theme.custom.spacing.medium}>
      {contextHolder}

      <Typography.Title level={3}>{t('common.userResetPassword')}</Typography.Title>

      <BaseEditSection  onSave={handleResetPassword}>
        <Form
          style={{
            width: '100%',
            maxWidth: 600,
          }}
          form={form}
          layout="vertical"
        >
          <Form.Item
            label={t('common.password')}
            name="password"
            rules={[
              { required: true, message: t('messages.passwordIsRequired') },
              { min: 8, message: t('messages.passwordMustBeAtLeastEightCharacters') },
              {
                pattern: /[A-Z]/,
                message: t('messages.passwordMustContainUppercase'),
              },
              {
                pattern: /[a-z]/,
                message: t('messages.passwordMustContainLowercase'),
              },
              {
                pattern: /[0-9]/,
                message: t('messages.passwordMustContainNumber'),
              },
              {
                pattern: /[^A-Za-z0-9]/,
                message: t('messages.passwordMustContainSpecialCharacter'),
              },
            ]}
          >
            <Input.Password size="large" placeholder={t('common.password')}/>
          </Form.Item>

          <Form.Item
            label={t('common.passwordConfirm')}
            name="passwordConfirm"
            dependencies={['password']}
            rules={[
              { required: true, message: t('messages.passwordConfirmIsRequired') },
              { min: 8, message: t('messages.passwordConfirmMustBeAtLeastEightCharacters') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('messages.passwordConfirmError')));
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder={t('common.passwordConfirm')}/>
          </Form.Item>
        </Form>
      </BaseEditSection>
    </Flex>
  );
};
