import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Divider,
  Dropdown,
  Flex,
  Spin,
  Typography,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Notification } from '@shared/types/Notification';

import {
  useGetMeNotificationApi,
  type GetMeNotificationResponse,
} from '@shared/hooks/useGetMeNotification';
import {
  useMarkNotificationAsSeenApi,
  type MarkNotificationAsSeenResponse,
} from '@shared/hooks/notification/useMarkNotificationAsSeenApi';
import {
  useMarkAllNotificationAsSeenApi,
  type MarkAllNotificationAsSeenResponse,
} from '@shared/hooks/notification/useMarkAllNotificationAsSeenApi';
import {
  useClearAllNotificationApi,
  type ClearAllNotificationResponse,
} from '@shared/hooks/notification/useClearAllNotificationApi';

import { NotificationItem } from './NotificationItem';
import { Broom, CheckRead } from '@solar-icons/react';

interface Props {
  children: React.ReactNode;
}

export const NotificationsDropdown: React.FC<Props> = ({ children }) => {
  const theme = useTheme();

  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const {
    getMeNotification,
    data: getMeNotificationData,
    loading: getMeNotificationLoading,
  } = useGetMeNotificationApi<GetMeNotificationResponse>();

  const {
    markNotificationAsSeen,
  } = useMarkNotificationAsSeenApi<MarkNotificationAsSeenResponse>();

  const {
    markAllNotificationAsSeen,
    data: markAllNotificationAsSeenData,
    loading: markAllNotificationAsSeenLoading,
  } = useMarkAllNotificationAsSeenApi<MarkAllNotificationAsSeenResponse>();

  const {
    clearAllNotification,
    data: clearAllNotificationData,
    loading: clearAllNotificationLoading,
  } = useClearAllNotificationApi<ClearAllNotificationResponse>();

  const handleGetMeNotification = () => {
    getMeNotification({
      page,
      page_size: 20,
    });
  };

  useEffect(() => {
    if (page === 1 ) setNotifications([]);

    handleGetMeNotification();
  }, [page]);

  useEffect(() => {
    if (getMeNotificationData && getMeNotificationData.data) {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...(getMeNotificationData.data as unknown as Notification[]),
      ]);
    }
  }, [getMeNotificationData]);

  useEffect(() => {
    if (markAllNotificationAsSeenData) {
      setPage(1);
    }
  }, [markAllNotificationAsSeenData]);

  useEffect(() => {
    if (clearAllNotificationData) {
      setPage(1);
    }
  }, [clearAllNotificationData]);

  if (!getMeNotificationData) return null;

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      dropdownRender={(menu) => (
        <Flex
          vertical={true}
          gap={theme.custom.spacing.xsmall}
          style={{
            width: 350,
            maxHeight: 500,
            padding: theme.custom.spacing.medium,
            backgroundColor: theme.custom.colors.background.light,
            border: `1px solid ${theme.custom.colors.neutral[200]}`,
            borderRadius: theme.custom.radius.medium,
            boxShadow: theme.custom.shadows.xsmall,
          }}
        >
          <Flex justify="space-between" align="center">
            <Typography.Text strong>{t('overviewV2.notifications')}</Typography.Text>

            <Flex>
              <Button
                type="text"
                icon={<CheckRead />}
                onClick={() => markAllNotificationAsSeen()}
                loading={markAllNotificationAsSeenLoading}
              />
              <Button
                type="text"
                icon={<Broom />}
                onClick={() => clearAllNotification()}
                loading={clearAllNotificationLoading}
              />
            </Flex>
          </Flex>

          <Divider size="middle" style={{ margin: 0 }} />

          <Flex
            vertical={true}
            gap={theme.custom.spacing.xsmall}
            style={{
              overflowY: 'auto',
              width: '100%',
              height: '100%',
            }}
          >
            {notifications.map((notification: Notification) => (
              <NotificationItem
                notification={notification as unknown as Notification}
                onMarkNotificationAsSeen={(notification_id: string) => markNotificationAsSeen(notification_id)}
              />
            ))}
          </Flex>

          {getMeNotificationLoading && <Spin size="small" />}

          {notifications.length > 0 && getMeNotificationData.total_pages > page && (
            <Typography.Link
              style={{ textAlign: 'center' }}
              onClick={() => setPage(page + 1)}
            >
              {t('common.loadMore')}
            </Typography.Link>
          )}
        </Flex>
      )}
    >
      {children}
    </Dropdown>
  );
};
