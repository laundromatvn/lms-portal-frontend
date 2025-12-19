import React from 'react';

import { Button, Flex, Skeleton } from 'antd';

import { PenNewSquare } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { Box } from '@shared/components/Box';
import { BaseSectionTitle } from './BaseSectionTitle';

interface Props {
  title?: string;
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
        {title && <BaseSectionTitle title={title} onRefresh={onRefresh} />}

        <Flex justify="end" gap={theme.custom.spacing.small}>
          {onEdit && (
            <Button
              type="link"
              onClick={onEdit}
              icon={<PenNewSquare size={16} />}
            />
          )}
        </Flex>
      </Flex>

      {loading ? <Skeleton active /> : children}
    </Box>
  );
};
