import React from 'react';

import { Typography, Button, Flex } from 'antd';

import { Refresh } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

interface Props {
  title: string;
  onRefresh?: () => void;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const BaseSectionTitle: React.FC<Props> = ({ title, onRefresh, onClick, style }) => {
  const theme = useTheme();

  return (
    <Flex gap={theme.custom.spacing.xsmall}>
      {onClick ? (
        <Typography.Link
          strong
          style={{
            fontSize: theme.custom.fontSize.large,
            ...style,
          }}
          onClick={onClick}
        >
          {title}
        </Typography.Link>
      ) : (
        <Typography.Text
          strong
          style={{
            fontSize: theme.custom.fontSize.large,
            ...style,
          }}
        >
          {title}
        </Typography.Text>
      )}

      {onRefresh && (
        <Button
          type="text"
          icon={<Refresh size={16} />}
          onClick={onRefresh}
        />
      )}
    </Flex>
  );
};
