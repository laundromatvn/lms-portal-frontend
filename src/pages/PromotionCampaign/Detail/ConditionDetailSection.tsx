import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import { CheckCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';

import { PromotionBaseHeader } from '../components/PromotionBaseHeader';
import { ConditionItemCard } from '../components/ConditionItemCard';
import { buildConditionDescription } from '../helpers';

interface Props {
  conditions: PromotionCondition[];
}

export const ConditionDetailSection: React.FC<Props> = ({ conditions }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const primaryColor = theme.custom.colors.info.default;

  return (
    <Flex vertical gap={theme.custom.spacing.small} style={{ width: '100%' }}>
      <PromotionBaseHeader
        title={t('common.conditions')}
        icon={<CheckCircle weight='BoldDuotone' size={24} color={primaryColor} />}
        style={{ marginBottom: theme.custom.spacing.small }}
      />

      {conditions.map((condition, index) => (
        <ConditionItemCard
          key={index}
          title={t(`promotionCampaign.condition_types.${condition.type}`)}
          description={buildConditionDescription(condition, t)}
        />
      ))}
    </Flex>
  );
};
