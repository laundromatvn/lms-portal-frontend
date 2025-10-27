import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Button,
  Flex,
  Typography,
  Skeleton,
  notification,
  type FormInstance,
} from 'antd';

import { ArrowLeft } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { userStorage } from '@core/storage/userStorage';

import { type User } from '@shared/types/user';

import {
  useResetPasswordApi,
  type ResetPasswordResponse
} from '@shared/hooks/useResetPasswordApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { ResetPasswordSection } from './ResetPasswordSection';

export const UserResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const user = userStorage.load();

  const {
    resetPassword,
    data: resetPasswordData,
    error: resetPasswordError,
  } = useResetPasswordApi<ResetPasswordResponse>();

  const onSave = (form: FormInstance) => {
    resetPassword(user?.id as string, {
      password: form.getFieldValue('password'),
    });
  }

  useEffect(() => {
    if (resetPasswordError) {
      api.error({
        message: t('messages.resetPasswordError'),
      });
    }
  }, [resetPasswordError]);

  useEffect(() => {
    if (resetPasswordData) {
      api.success({
        message: t('messages.resetPasswordSuccess'),
      });
    }
  }, [resetPasswordData]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('common.userResetPassword')}</Typography.Title>

        <LeftRightSection
          left={(
            <Button
              type="link"
              icon={<ArrowLeft color={theme.custom.colors.text.primary} />}
              onClick={() => navigate(-1)}
            >
              {t('common.back')}
            </Button>
          )}
          right={null}
        />

        {!user && <Skeleton active />}

        {user && (
          <ResetPasswordSection
            user={user as User}
            onSave={onSave}
          />
        )}
      </Flex>
    </PortalLayout>
  );
};
