import React, { useMemo, useState } from 'react';

import { Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { type Notification } from '@shared/types/Notification';

import { Box } from '@shared/components/Box';

interface Props {
  notification: Notification;
  style?: React.CSSProperties;
  onMarkNotificationAsSeen: (notification_id: string) => void;
}

export const NotificationItem: React.FC<Props> = ({ notification, style, onMarkNotificationAsSeen }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [isHovered, setIsHovered] = useState(false);
  const [isMarkedAsSeen, setIsMarkedAsSeen] = useState(notification.seen_at !== null);

  const backgroundColor = useMemo(() => {
    if (isHovered && !isMobile) return theme.custom.colors.primary.light;

    if (isMarkedAsSeen) return theme.custom.colors.background.overlay;

    return theme.custom.colors.background.light;
  }, [isHovered, isMarkedAsSeen]);

  return (
    <Box
      vertical
      style={{
        width: '100%',
        maxWidth: 324,
        padding: theme.custom.spacing.xsmall,
        backgroundColor: backgroundColor,
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!isMarkedAsSeen) {
          onMarkNotificationAsSeen(notification.id);
          setIsMarkedAsSeen(true);
        }
      }}
    >
      <Typography.Text>{notification.title}</Typography.Text>

      <Typography.Paragraph
        type="secondary"
        ellipsis={{
          rows: 3,
          expandable: true,
          symbol: 'more',
        }}
        style={{
          fontSize: theme.custom.fontSize.xsmall,
          marginBottom: 0,
        }}
      >
        {notification.message}
      </Typography.Paragraph>
    </Box>
  );
};
