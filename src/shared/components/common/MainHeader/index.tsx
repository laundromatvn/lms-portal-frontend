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
        width: '100%',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
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

      {title && (
        <Typography.Text
          strong
          style={{
            marginBottom: 0,
            fontSize: theme.custom.fontSize.large,
            ...style,
          }}
        >
          {title}
        </Typography.Text>
      )}
    </AntdHeader>
  );
};
