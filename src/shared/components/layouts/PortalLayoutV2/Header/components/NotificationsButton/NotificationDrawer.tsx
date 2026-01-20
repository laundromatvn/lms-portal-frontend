import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Drawer, Flex, List, Typography } from 'antd';
import { CheckRead, Broom, Refresh } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

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

import { type Notification } from '@shared/types/Notification';

import { NotificationItem } from './NotificationItem';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ open, onClose }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const {
    getMeNotification,
    data: notificationsData,
    loading: notificationsLoading,
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
    getMeNotification({ page: page, page_size: 20 });
  };

  useEffect(() => {
    if (notificationsData && notificationsData.data) {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...(notificationsData.data as unknown as Notification[]),
      ]);
    }
  }, [notificationsData]);

  useEffect(() => {
    if (markAllNotificationAsSeenData) {
      handleGetMeNotification();
    }
  }, [markAllNotificationAsSeenData]);

  useEffect(() => {
    if (clearAllNotificationData) {
      handleGetMeNotification();
    }
  }, [clearAllNotificationData]);

  useEffect(() => {
    handleGetMeNotification();
  }, [page]);

  if (!notificationsData) return null;

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={open}
      width={600}
      styles={{
        header: {
          backgroundColor: theme.custom.colors.background.light,
        },
        body: {
          padding: theme.custom.spacing.medium,
          backgroundColor: theme.custom.colors.background.light,
        },
      }}
      title={
        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
          <Typography.Text strong>{t('overviewV2.notifications')}</Typography.Text>

          <Flex gap={theme.custom.spacing.small}>
            <Button
              type="text"
              icon={<CheckRead />}
              onClick={markAllNotificationAsSeen}
              loading={markAllNotificationAsSeenLoading}
            />
            <Button
              type="text"
              icon={<Broom />}
              onClick={clearAllNotification}
              loading={clearAllNotificationLoading}
            />
          </Flex>
        </Flex>
      }
    >
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item key={item.id} style={{ width: '100%', border: 'none', paddingBottom: 0 }}>
            <NotificationItem
              notification={item as unknown as Notification}
              onMarkNotificationAsSeen={(notification_id: string) => markNotificationAsSeen(notification_id)}
              style={{ width: '100%', maxWidth: 'none' }}
            />
          </List.Item>
        )}
        style={{ width: '100%' }}
        loading={notificationsLoading}
        loadMore={notifications.length > 0 && notificationsData?.total_pages > page && (
          <Flex justify="center" align="center" style={{ width: '100%' }}>
            <Typography.Link onClick={() => setPage(page + 1)} >
              {t('common.loadMore')}
            </Typography.Link>
          </Flex>
        )}
      />
    </Drawer>
  );
};
