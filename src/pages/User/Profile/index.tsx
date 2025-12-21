import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { userStorage } from '@core/storage/userStorage';

import {
  useGetUserApi,
  type GetUserResponse,
} from '@shared/hooks/useGetUserApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { UserProfileDetailSection } from './DetailSection';
import { UserProfilePasswordSection } from './PasswordSection';

export const UserProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

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
    <PortalLayoutV2
      title={t('navigation.userProfile')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <Flex
        vertical={true}
        gap={theme.custom.spacing.medium}
        style={{ height: '100%' }}
      >
        <UserProfileDetailSection />
        <UserProfilePasswordSection />
      </Flex>
    </PortalLayoutV2>
  );
};
