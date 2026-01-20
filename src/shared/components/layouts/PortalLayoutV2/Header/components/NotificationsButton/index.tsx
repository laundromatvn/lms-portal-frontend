import React, { useState } from 'react';

import { Button } from 'antd';

import { Bell } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { NotificationsDropdown } from './NotificationsDropdown';
import { NotificationDrawer } from './NotificationDrawer';

export const NotificationsButton: React.FC = () => {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleButtonClick = () => {
    if (isMobile) {
      setIsDrawerOpen(true);
    }
  };

  return (
    <>
      {isMobile ? (
        <>
          <Button
            shape="circle"
            icon={<Bell />}
            onClick={handleButtonClick}
            style={{
              backgroundColor: theme.custom.colors.background.overlay,
              border: 'none',
            }}
          />
          <NotificationDrawer
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        </>
      ) : (
        <NotificationsDropdown>
          <Button
            shape="circle"
            icon={<Bell />}
            style={{
              backgroundColor: theme.custom.colors.background.overlay,
              border: 'none',
            }}
          />
        </NotificationsDropdown>
      )}
    </>
  );
};