import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'antd';

import { CloseCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';

import { PromotionBaseHeader } from '../components/Modals';
import { LimitItemCard } from '../components/Modals';

interface Props {
  limits: PromotionLimit[];
}

export const LimitDetailSection: React.FC<Props> = ({ limits }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const primaryColor = theme.custom.colors.warning.default;

  return (
    <Flex vertical gap={theme.custom.spacing.small} style={{ width: '100%' }}>
      <PromotionBaseHeader
        title={t('common.limits')}
        icon={<CloseCircle weight='BoldDuotone' size={24} color={primaryColor} />}
        style={{ marginBottom: theme.custom.spacing.small }}
      />

      {limits.map((limit, index) => (
        <LimitItemCard key={index} limit={limit} />
      ))}
    </Flex>
  );
};
