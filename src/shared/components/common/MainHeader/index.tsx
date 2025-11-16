import React from 'react';

import {
  Button,
  Flex,
  Layout,
  Typography,
} from 'antd';

import { AltArrowLeft } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

const { Header: AntdHeader } = Layout;

interface Props {
  title?: string;
  onBack?: () => void;
  style?: React.CSSProperties;
}

export const MainHeader: React.FC<Props> = ({
  title,
  onBack,
  style,
}) => {
  const theme = useTheme();

  return (
    <AntdHeader
      style={{
        backgroundColor: theme.custom.colors.background.light,
        padding: theme.custom.spacing.medium,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        ...style,
      }}
    >
      {onBack && (
        <Button type="link" onClick={onBack}>
          <AltArrowLeft />
        </Button>
      )}

      {title && (
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          {title}
        </Typography.Title>
      )}
    </AntdHeader>
  );
};
