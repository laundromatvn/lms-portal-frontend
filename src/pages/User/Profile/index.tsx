import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { notification } from 'antd';

import { userStorage } from '@core/storage/userStorage';

import {
  useGetUserApi,
  type GetUserResponse,
} from '@shared/hooks/useGetUserApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';

import { UserProfileDetailSection } from './DetailSection';
import { UserProfilePasswordSection } from './PasswordSection';

export const UserProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const user = userStorage.load();

  const {
    getUser,
    data: getUserData,
    error: getUserError,
  } = useGetUserApi<GetUserResponse>();

  useEffect(() => {
    getUser(user?.id as string);
  }, []);

  useEffect(() => {
    if (getUserError) {
      api.error({
        message: t('messages.getUserError'),
      });
    }
  }, [getUserError]);

  useEffect(() => {
    if (getUserData) {
      userStorage.save(getUserData);
    }
  }, [getUserData]);

  return (
    <PortalLayout title={t('navigation.userProfile')} onBack={() => navigate(-1)}>
      {contextHolder}

      <UserProfileDetailSection />

      <UserProfilePasswordSection />
    </PortalLayout>
  );
};
