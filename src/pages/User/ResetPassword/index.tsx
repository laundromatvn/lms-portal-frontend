import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Flex,
  Skeleton,
  notification,
  type FormInstance,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { userStorage } from '@core/storage/userStorage';

import { type User } from '@shared/types/user';

import {
  useResetPasswordApi,
  type ResetPasswordResponse
} from '@shared/hooks/useResetPasswordApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
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
    <PortalLayoutV2 title={t('common.userResetPassword')} onBack={() => navigate(-1)}>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        {!user && <Skeleton active />}

        {user && (
          <ResetPasswordSection
            user={user as User}
            onSave={onSave}
          />
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
