import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Drawer, Flex, Button, notification, Input, Form } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useResetPasswordApi,
  type ResetPasswordResponse,
} from '@shared/hooks/useResetPasswordApi';

interface Props {
  user_id: string;
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}

export const ResetPasswordDrawer: React.FC<Props> = ({
  user_id,
  isDrawerOpen,
  setIsDrawerOpen,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const {
    resetPassword,
    data: resetPasswordData,
    loading: resetPasswordLoading,
    error: resetPasswordError,
  } = useResetPasswordApi<ResetPasswordResponse>();

  const handleResetPassword = async () => {
    try {
      await form.validateFields();
      const password = form.getFieldValue('password');
      resetPassword(user_id, { password });
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (!resetPasswordData) return;

    setIsDrawerOpen(false);
    form.resetFields();

    api.success({
      message: t('messages.resetPasswordSuccess'),
    });

    onSuccess?.();
  }, [resetPasswordData]);

  useEffect(() => {
    if (!resetPasswordError) return;

    api.error({
      message: t('messages.resetPasswordError'),
    });
  }, [resetPasswordError]);

  useEffect(() => {
    if (isDrawerOpen) {
      form.setFieldsValue({
        password: '',
        passwordConfirm: '',
      });
    }
  }, [isDrawerOpen]);

  return (
    <Drawer
      title={t('common.userResetPassword')}
      placement="right"
      onClose={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      width={600}
      styles={{
        body: {
          padding: theme.custom.spacing.medium,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {contextHolder}

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', height: '100%' }}
      >
        <Flex
          vertical
          gap={theme.custom.spacing.medium}
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <Form
            style={{
              width: '100%',
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
              <Input.Password size="large" placeholder={t('common.password')} />
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
              <Input.Password size="large" placeholder={t('common.passwordConfirm')} />
            </Form.Item>
          </Form>
        </Flex>

        <Flex justify="flex-end" gap={theme.custom.spacing.medium} style={{ width: '100%', marginTop: 'auto' }}>
          <Button
            type="default"
            size="large"
            onClick={() => setIsDrawerOpen(false)}
            style={{ width: '100%' }}
          >
            {t('common.cancel')}
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={handleResetPassword}
            loading={resetPasswordLoading}
            style={{ width: '100%' }}
          >
            {t('common.resetPassword')}
          </Button>
        </Flex>
      </Flex>
    </Drawer>
  );
};

