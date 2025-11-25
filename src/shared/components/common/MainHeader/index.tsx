import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Flex,
  Layout,
  Typography,
} from 'antd';

import {
  AltArrowLeft,
  HamburgerMenu,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

const { Header: AntdHeader } = Layout;

interface Props {
  title?: string;
  onTitleClick?: () => void;
  onBack?: () => void;
  style?: React.CSSProperties;
}

export const MainHeader: React.FC<Props> = ({
  title,
  onTitleClick,
  onBack,
  style,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <AntdHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        height: 64,
        backgroundColor: theme.custom.colors.background.light,
        padding: theme.custom.spacing.medium,
        boxShadow: theme.custom.shadows.small,
        ...style,
      }}
    >
      {onBack && (
        <Button
          type="text"
          onClick={onBack}
          style={{
            padding: 0,
            paddingRight: theme.custom.spacing.xsmall,
          }}
        >
          <AltArrowLeft size={18} />
        </Button>
      )}

      {title && onTitleClick === undefined && (
        <Typography.Text strong style={{ fontSize: theme.custom.fontSize.large }}>
          {title}
        </Typography.Text>
      )}

      {title && onTitleClick && (
        <Typography.Link
          strong
          style={{
            fontSize: theme.custom.fontSize.large,
            cursor: 'pointer',
          }}
          onClick={onTitleClick}
        >
          {title}
        </Typography.Link>
      )}
    </AntdHeader>
  );
};
