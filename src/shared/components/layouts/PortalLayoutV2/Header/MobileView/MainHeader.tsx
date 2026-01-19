import React from 'react';

import { Button, Flex, Typography } from 'antd';

import { AltArrowLeft, HamburgerMenu } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { userStorage } from '@core/storage/userStorage';

import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

import { SubscriptionExpiryWarning } from '../components/SubscriptionExpiryWarning';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  onTitleClick?: () => void;
  onBack?: () => void;
  style?: React.CSSProperties;
}

export const MainHeader: React.FC<HeaderProps> = ({ title, showLogo, onTitleClick, onBack, style }) => {
  const theme = useTheme();
  const user = userStorage.load();

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        height: 64,
        padding: theme.custom.spacing.medium,
        borderBottom: `1px solid ${theme.custom.colors.neutral[200]}`,
        backgroundColor: theme.custom.colors.background.light,
        ...style,
      }}
    >
      <Flex align="center" gap={theme.custom.spacing.xxsmall} style={{ width: '100%' }}>
        {showLogo && (
          <Button
            type="text"
            onClick={onTitleClick}
            style={{ padding: 0, paddingRight: theme.custom.spacing.xsmall }}
          >
            <HamburgerMenu size={18} />
          </Button>
        )}

        {onBack && (
          <Button type="text" onClick={onBack} style={{ padding: 0, paddingRight: theme.custom.spacing.xsmall }}>
            <AltArrowLeft size={18} />
          </Button>
        )}

        {title && onTitleClick === undefined && (
          <Typography.Text strong>{title}</Typography.Text>
        )}

        {title && onTitleClick && (
          <Typography.Link
            strong
            onClick={onTitleClick}
          >
            {title}
          </Typography.Link>
        )}
      </Flex>

      <Flex justify="end" align="center" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        {user?.role !== UserRoleEnum.ADMIN && <SubscriptionExpiryWarning />}
      </Flex>
    </Flex>
  );
};
