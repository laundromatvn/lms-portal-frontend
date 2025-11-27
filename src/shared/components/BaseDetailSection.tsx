import React from 'react';

import { Button, Flex, Skeleton, Typography } from 'antd';

import { PenNewSquare, Refresh } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import LeftRightSection from '@shared/components/LeftRightSection';

import { Box } from '@shared/components/Box';

interface Props {
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
  style?: React.CSSProperties;
}

export const BaseDetailSection: React.FC<Props> = ({
  title,
  children,
  onEdit,
  onRefresh,
  loading = false,
  style,
}) => {
  const theme = useTheme();

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%', ...style }} loading={loading}>
      <Flex justify="space-between" align="center" style={{ width: '100%' }}>
        <Typography.Title level={3}>{title}</Typography.Title>

        <Flex justify="end" gap={theme.custom.spacing.small}>
          {onRefresh && (
            <Button
              type="text"
              onClick={onRefresh}
              icon={<Refresh size={18} />}
            />
          )}

          {onEdit && (
            <Button
              type="link"
              onClick={onEdit}
              icon={<PenNewSquare size={18} />}
            />
          )}
        </Flex>
      </Flex>

      {loading ? <Skeleton active /> : children}
    </Box>
  );
};
