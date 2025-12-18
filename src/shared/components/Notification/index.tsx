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
    if (notification.status === NotificationStatusEnum.NEW) return primaryColor;

    return theme.custom.colors.neutral[200];
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
    >
      <Flex justify="space-between" gap={theme.custom.spacing.xxsmall} style={{ width: '100%' }}>
        <Flex align="center" gap={theme.custom.spacing.xxsmall}>
          <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
            {formatDateTime(notification.created_at)}
          </Typography.Text>

          <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
            |
          </Typography.Text>

          <Typography.Text
            strong
            style={{
              fontSize: theme.custom.fontSize.xsmall,
              color: primaryColor
            }}
          >
            {notification.type.toLowerCase()}
          </Typography.Text>
        </Flex>

        {notification.status === NotificationStatusEnum.NEW && (
          <Button
            type="link"
            size="small"
            style={{
              fontSize: theme.custom.fontSize.xsmall,
            }}
            onClick={() => markNotificationAsSeen(notification.id)}
          >
            {t('common.confirm')}
          </Button>
        )}
      </Flex>

      <Typography.Text
        strong
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {notification.title}
      </Typography.Text>

      <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.small }}>
        {notification.message}
      </Typography.Text>
    </Box>
  );
};
