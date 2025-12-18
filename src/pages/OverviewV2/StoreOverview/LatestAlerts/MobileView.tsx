import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  List,
  Button,
  Flex,
} from 'antd';

import { CheckRead } from '@solar-icons/react';

import {
  useGetMeNotificationApi,
  type GetMeNotificationResponse,
} from '@shared/hooks/useGetMeNotification';
import {
  useMarkAllNotificationAsSeenApi,
  type MarkAllNotificationAsSeenResponse,
} from '@shared/hooks/notification/useMarkAllNotificationAsSeenApi';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { Notification } from '@shared/components/Notification';

export const MobileView: React.FC = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

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

  const handleGetMeNotification = () => {
    getMeNotification({ page, page_size: pageSize });
  };

  useEffect(() => {
    handleGetMeNotification();
  }, []);

  useEffect(() => {
    if (!markAllNotificationAsSeenData) return;

    handleGetMeNotification();
  }, [markAllNotificationAsSeenData]);

  return (
    <BaseDetailSection
      title={t('overviewV2.alerts')}
      onRefresh={handleGetMeNotification}
    >
      <Flex justify="end" style={{ width: '100%' }}>
        <Button
          onClick={markAllNotificationAsSeen}
          loading={markAllNotificationAsSeenLoading}
          icon={<CheckRead />}
        >
          {t('overviewV2.markAllAsSeen')}
        </Button>
      </Flex>

      <List
        dataSource={getMeNotificationData?.data}
        loading={getMeNotificationLoading}
        style={{ width: '100%' }}
        pagination={{
          pageSize: pageSize,
          total: getMeNotificationData?.total || 0,
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
