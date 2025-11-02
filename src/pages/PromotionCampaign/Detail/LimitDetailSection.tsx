import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, Typography } from 'antd';

import { CloseCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';

import { PromotionBaseHeader } from './components/PromotionBaseHeader';
import { PromotionBaseCard } from './components/PromotionBaseCard';

interface Props {
  limits: PromotionLimit[];
}

export const LimitDetailSection: React.FC<Props> = ({ limits }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const primaryColor = theme.custom.colors.danger.default;
  const lightColor = theme.custom.colors.danger.light;

  return (
    <Flex vertical gap={theme.custom.spacing.small} style={{ width: '100%' }}>
      <PromotionBaseHeader
        title={t('common.limits')}
        icon={<CloseCircle weight='BoldDuotone' size={24} color={primaryColor} />}
        style={{ marginBottom: theme.custom.spacing.small }}
      />

      {limits.map((limit) => (
        <PromotionBaseCard
          title={t(`promotionCampaign.limit_types.${limit.type}`)}
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
            {limit.value} {limit.unit && `(${t(`promotionCampaign.unit.${limit.unit}`)})`}
          </Typography.Text>
        </PromotionBaseCard>
      ))}
    </Flex>
  );
};
