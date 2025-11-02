import React from 'react';

import { Button, Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { PenNewSquare, TrashBinTrash } from '@solar-icons/react';

interface Props {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PromotionBaseCard: React.FC<Props> = ({ title, children, style, onEdit, onDelete }: Props) => {
  const theme = useTheme();

  return (
    <Flex
      gap={theme.custom.spacing.xxsmall}
      style={{
        width: '100%',
        padding: theme.custom.spacing.xsmall,
        ...style,
      }}
    >
      <Flex vertical align="start" gap={theme.custom.spacing.xxsmall} style={{ width: '100%' }}>
        <Typography.Text strong style={{ marginBottom: theme.custom.spacing.xxsmall }}>{title}</Typography.Text>
        {children}
      </Flex>

      <Flex justify="end" align="center" gap={theme.custom.spacing.xsmall} style={{ height: '100%' }}>
        {onEdit && <Button type="text" style={{ color: theme.custom.colors.info.default }} icon={<PenNewSquare weight='Outline' size={18} />} onClick={onEdit} />}

        {onDelete && <Button type="text" style={{ color: theme.custom.colors.danger.default }} icon={<TrashBinTrash weight='Outline' size={18} />} onClick={onDelete} />}
      </Flex>
    </Flex>
  );
};
