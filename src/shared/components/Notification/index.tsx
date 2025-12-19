import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Typography,
  Button,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useMarkNotificationAsSeenApi,
  type MarkNotificationAsSeenResponse,
} from '@shared/hooks/notification/useMarkNotificationAsSeenApi';

import { NotificationTypeEnum } from '@shared/enums/NotificationTypeEnum';
import { NotificationStatusEnum } from '@shared/enums/NotificationStatusEnum';
import { type Notification as NotificationType } from '@shared/types/Notification';

import { Box } from '@shared/components/Box';
import { formatDateTime } from '@shared/utils/date';
import { DynamicTag } from '../DynamicTag';

interface Props {
  notification: NotificationType;
  onSuccess?: () => void;
}

export const Notification: React.FC<Props> = ({ notification, onSuccess }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const primaryColor = useMemo(() => {
    switch (notification.type) {
      case NotificationTypeEnum.INFO:
        return theme.custom.colors.info.default;
      case NotificationTypeEnum.ERROR:
        return theme.custom.colors.danger.default;
      default:
        return theme.custom.colors.neutral.default;
    }
  }, [notification]);

  const lightColor = useMemo(() => {
    switch (notification.type) {
      case NotificationTypeEnum.INFO:
        return theme.custom.colors.info.light;
      case NotificationTypeEnum.ERROR:
        return theme.custom.colors.danger.light;
    }
  }, [notification]);

  const borderColor = useMemo(() => {
    if (notification.status === NotificationStatusEnum.SEEN) return theme.custom.colors.neutral[200];

    switch (notification.type) {
      case NotificationTypeEnum.INFO:
        return theme.custom.colors.info.dark;
      case NotificationTypeEnum.ERROR:
        return theme.custom.colors.danger.dark;
      default:
        return theme.custom.colors.neutral[200];
    }
  }, [notification]);

  const backgroundColor = useMemo(() => {
    if (notification.status === NotificationStatusEnum.NEW) return lightColor;

    return theme.custom.colors.background.light;
  }, [notification]);

  const {
    markNotificationAsSeen,
    data: markNotificationAsSeenData,
  } = useMarkNotificationAsSeenApi<MarkNotificationAsSeenResponse>();

  useEffect(() => {
    if (!markNotificationAsSeenData) return;

    onSuccess?.();
  }, [markNotificationAsSeenData]);

  return (
    <Box
      border
      vertical
      justify="space-between"
      align="flex-start"
      gap={theme.custom.spacing.xsmall}
      style={{
        width: '100%',
        padding: theme.custom.spacing.medium,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
      }}
      onClick={() => notification.status === NotificationStatusEnum.NEW
        ? markNotificationAsSeen(notification.id)
        : undefined
      }
    >
      <Flex justify="space-between" gap={theme.custom.spacing.xxsmall} style={{ width: '100%' }}>
        <Flex justify="start" align="center" gap={theme.custom.spacing.xxsmall}>
          <Typography.Text
            type="secondary"
            style={{ fontSize: theme.custom.fontSize.xsmall }}
          >
            {formatDateTime(notification.created_at)}
          </Typography.Text>

          <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
            •
          </Typography.Text>

          <DynamicTag value={notification.type} type="text" />
        </Flex>

        <Flex justify="end" align="center" gap={theme.custom.spacing.xxsmall}>
          {notification.status === NotificationStatusEnum.SEEN && (
            <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
              {t('common.seen')}
            </Typography.Text>
          )}
        </Flex>
      </Flex>

      <Typography.Text ellipsis>
        {notification.title}
      </Typography.Text>

      <Typography.Text
        type="secondary"
        style={{
          fontSize: theme.custom.fontSize.small,
        }}
      >
        {notification.message}
      </Typography.Text>
    </Box>
  );
};
