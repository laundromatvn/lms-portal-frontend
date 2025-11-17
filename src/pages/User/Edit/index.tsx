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

import { useUpdateUserApi, type UpdateUserResponse } from '@shared/hooks/useUpdateUserApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import { EditSection } from './EditSection';

export const UserEditPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const user = userStorage.load();

  const {
    updateUser,
    data: updateUserData,
    error: updateUserError,
  } = useUpdateUserApi<UpdateUserResponse>();

  const onSave = (form: FormInstance) => {
    updateUser(user?.id as string, {
      name: form.getFieldValue('name'),
      phone: form.getFieldValue('phone'),
    });
  }

  useEffect(() => {
    if (updateUserError) {
      api.error({
        message: t('messages.updateUserError'),
      });
    }
  }, [updateUserError]);

  useEffect(() => {
    if (updateUserData) {
      api.success({
        message: t('messages.updateUserSuccess'),
      });
    }
  }, [updateUserData]);

  return (
    <PortalLayout title={t('common.userEdit')} onBack={() => navigate(-1)}>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        {!user && <Skeleton active />}

        {user && (
          <EditSection
            user={user as User}
            onSave={onSave}
          />
        )}
      </Flex>
    </PortalLayout>
  );
};
