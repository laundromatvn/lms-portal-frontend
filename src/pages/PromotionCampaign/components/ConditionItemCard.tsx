import React from 'react';

import { Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { PromotionBaseCard } from './PromotionBaseCard';

interface Props {
  title: string;
  description: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ConditionItemCard: React.FC<Props> = ({ title, description, onEdit, onDelete }: Props) => {
  const theme = useTheme();

  const primaryColor = theme.custom.colors.info.default;
  const lightColor = theme.custom.colors.info.light;

  return (
    <PromotionBaseCard
      title={title}
      onEdit={onEdit}
      onDelete={onDelete}
      style={{
        backgroundColor: lightColor,
        color: primaryColor,
        borderColor: primaryColor,
        borderLeft: `4px solid ${primaryColor}`,
      }}
    >
      <Typography.Text>
        {description}
      </Typography.Text>
    </PromotionBaseCard>
  );
};

