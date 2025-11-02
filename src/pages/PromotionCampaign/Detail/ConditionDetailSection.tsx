import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, Typography } from 'antd';

import { CheckCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';

import { PromotionBaseHeader } from './components/PromotionBaseHeader';
import { PromotionBaseCard } from './components/PromotionBaseCard';

interface Props {
  conditions: PromotionCondition[];
}

export const ConditionDetailSection: React.FC<Props> = ({ conditions }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const primaryColor = theme.custom.colors.info.default;
  const lightColor = theme.custom.colors.info.light;

  return (
    <Flex vertical gap={theme.custom.spacing.small} style={{ width: '100%' }}>
      <PromotionBaseHeader
        title={t('common.conditions')}
        icon={<CheckCircle weight='BoldDuotone' size={24} color={primaryColor} />}
        style={{ marginBottom: theme.custom.spacing.small }}
      />

      {conditions.map((condition) => (
        <PromotionBaseCard
          title={t(`promotionCampaign.condition_types.${condition.type}`)}
          onEdit={() => {}}
          onDelete={() => {}}
          style={{
            backgroundColor: lightColor,
            color: primaryColor,
            borderColor: primaryColor,
            borderLeft: `4px solid ${primaryColor}`,
          }}
        >
          <Typography.Text>
            {t(`promotionCampaign.operator.${condition.operator}`)} {condition.value}
          </Typography.Text>
        </PromotionBaseCard>
      ))}
    </Flex>
  );
};
