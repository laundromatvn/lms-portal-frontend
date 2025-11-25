import React from 'react';

import { Button, Flex, Typography } from 'antd';
import { LeftOutlined, MenuOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';


interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  onTitleClick?: () => void;
  onBack?: () => void;
  style?: React.CSSProperties;
}

export const MainHeader: React.FC<HeaderProps> = ({ title, showLogo, onTitleClick, onBack, style }) => {
  const isMobile = useIsMobile();
  const theme = useTheme();

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
        {isMobile && showLogo && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onTitleClick}
            style={{ marginRight: theme.custom.spacing.small }}
          />
        )}

        {onBack && (
          <Button type="text" icon={<LeftOutlined />} onClick={onBack} />
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
    </Flex>
  );
};
