import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';
import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';
import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';
import { type PromotionReward } from '@shared/types/promotion/PromotionReward';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { ConditionDetailSection } from './ConditionDetailSection';
import { RewardDetailSection } from './RewardDetailSection';
import { LimitDetailSection } from './LimitDetailSection';

interface Props {
  promotionCampaign: PromotionCampaign;
}

export const PromotionDetailSection: React.FC<Props> = ({ promotionCampaign }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <BaseDetailSection title={t('common.promotionDetails')}>
      {promotionCampaign.conditions.length > 0 && <ConditionDetailSection conditions={promotionCampaign.conditions as PromotionCondition[]} />}
      {promotionCampaign.rewards.length > 0 && <RewardDetailSection rewards={promotionCampaign.rewards as PromotionReward[]} />}
      {promotionCampaign.limits.length > 0 && <LimitDetailSection limits={promotionCampaign.limits as PromotionLimit[]} />}
    </BaseDetailSection>
  );
};
