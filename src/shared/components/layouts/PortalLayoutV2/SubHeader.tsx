import React from 'react';

import { Flex, Typography, Button } from 'antd';

import { AltArrowLeft } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

interface SubHeaderProps {
  title?: string;
  extra?: React.ReactNode;
  onBack?: () => void;
  onTitleClick?: () => void;
  style?: React.CSSProperties;
}

export const SubHeader: React.FC<SubHeaderProps> = ({ title, extra, onBack, onTitleClick, style }) => {
  const theme = useTheme();

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        height: 56,
        padding: theme.custom.spacing.medium,
        backgroundColor: theme.custom.colors.background.light,
        borderBottom: `1px solid ${theme.custom.colors.neutral[200]}`,
        ...style,
      }}
    >
      <Flex align="center" gap={theme.custom.spacing.xxsmall} style={{ width: '100%' }}>
        {onBack && (
          <Button
            type="text"
            onClick={onBack}
            style={{ padding: 0, paddingRight: theme.custom.spacing.xsmall }}
          >
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

      {extra && <Flex align="center" gap={theme.custom.spacing.small}>{extra}</Flex>}
    </Flex>
  );
};
