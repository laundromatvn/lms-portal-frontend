import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  List,
  Button,
  Flex,
  Select,
} from 'antd';

import { CheckRead, Broom } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useGetMeNotificationApi,
  type GetMeNotificationResponse,
} from '@shared/hooks/useGetMeNotification';
import {
  useMarkAllNotificationAsSeenApi,
  type MarkAllNotificationAsSeenResponse,
} from '@shared/hooks/notification/useMarkAllNotificationAsSeenApi';
import {
  useClearAllNotificationApi,
  type ClearAllNotificationResponse,
} from '@shared/hooks/notification/useClearAllNotificationApi';

import { BaseSectionTitle } from '@shared/components/BaseSectionTitle';
import { Notification } from '@shared/components/Notification';
import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';
import { NotificationTypeEnum } from '@shared/enums/NotificationTypeEnum';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [type, setType] = useState<NotificationTypeEnum>();

  const notificationTypes = [
    NotificationTypeEnum.INFO,
    NotificationTypeEnum.ERROR,
  ]

  const {
    getMeNotification,
    data: getMeNotificationData,
    loading: getMeNotificationLoading,
  } = useGetMeNotificationApi<GetMeNotificationResponse>();
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
      page_size: pageSize,
      type,
    });
  };

  useEffect(() => {
    handleGetMeNotification();
  }, []);

  useEffect(() => {
    if (!markAllNotificationAsSeenData) return;

    handleGetMeNotification();
  }, [markAllNotificationAsSeenData]);

  useEffect(() => {
    if (!clearAllNotificationData) return;

    handleGetMeNotification();
  }, [clearAllNotificationData]);

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <BaseSectionTitle
        title={t('overviewV2.notifications')}
        onRefresh={handleGetMeNotification}
      />

      <Box
        vertical gap={theme.custom.spacing.medium}
        style={{ width: '100%' }}
      >
        <Flex align="center" justify="space-between" style={{ width: '100%' }}>
          <Select
            size="large"
            allowClear
            placeholder={t('messages.selectNotificationType')}
            onChange={(value: NotificationTypeEnum) => setType(value)}
            options={notificationTypes.map((item) => ({
              label: <DynamicTag value={item} type="text" />,
              value: item,
            }))}
            style={{ width: '100%', maxWidth: 256 }}
          />

          <Flex gap={theme.custom.spacing.small}>
            <Button
              type="link"
              icon={<CheckRead />}
              onClick={markAllNotificationAsSeen}
              loading={markAllNotificationAsSeenLoading}
            >
              {t('overviewV2.markAllAsSeen')}
            </Button>

            <Button
              icon={<Broom />}
              onClick={clearAllNotification}
              loading={clearAllNotificationLoading}
              style={{
                backgroundColor: theme.custom.colors.background.light,
                color: theme.custom.colors.text.tertiary,
                borderColor: theme.custom.colors.neutral[300],
              }}
            >
              {t('overviewV2.clearAll')}
            </Button>
          </Flex>
        </Flex>

        <List
          dataSource={getMeNotificationData?.data}
          loading={getMeNotificationLoading}
          style={{ width: '100%' }}
          pagination={{
            pageSize: pageSize,
            total: getMeNotificationData?.total || 0,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            style: { color: theme.custom.colors.text.tertiary },
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
          renderItem={(item) => (
            <List.Item key={item.id} style={{ width: '100%' }}>
              <Notification
                notification={item}
                onSuccess={handleGetMeNotification}
              />
            </List.Item>
          )}
        />
      </Box>
    </Flex>
  );
};
