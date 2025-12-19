import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  List,
  Select,
  Button,
  Flex,
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

import { NotificationTypeEnum } from '@shared/enums/NotificationTypeEnum';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { Notification } from '@shared/components/Notification';
import { DynamicTag } from '@shared/components/DynamicTag';

export const MobileView: React.FC = () => {
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
  }, [page, pageSize, type]);

  useEffect(() => {
    if (!markAllNotificationAsSeenData) return;

    handleGetMeNotification();
  }, [markAllNotificationAsSeenData]);

  useEffect(() => {
    if (!clearAllNotificationData) return;

    handleGetMeNotification();
  }, [clearAllNotificationData]);

  return (
    <BaseDetailSection>
      <Flex gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Select
          size="large"
          allowClear
          placeholder={t('messages.selectNotificationType')}
          onChange={(value: NotificationTypeEnum) => setType(value)}
          options={notificationTypes.map((item) => ({
            label: <DynamicTag value={item} type="text" />,
            value: item,
          }))}
          style={{ width: '100%' }}
        />

        <Button
          size="large"
          shape="circle"
          icon={<CheckRead size={20} />}
          onClick={markAllNotificationAsSeen}
          loading={markAllNotificationAsSeenLoading}
          style={{ backgroundColor: theme.custom.colors.background.light }}
        />

        <Button
          size="large"
          shape="circle"
          icon={<Broom size={20} />}
          onClick={clearAllNotification}
          loading={clearAllNotificationLoading}
          style={{ backgroundColor: theme.custom.colors.background.light }}
        />
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
    </BaseDetailSection>
  );
};
