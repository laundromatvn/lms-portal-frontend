import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { ConditionDetailSection } from './ConditionDetailSection';
import { RewardDetailSection } from './RewardDetailSection';
import { LimitDetailSection } from './LimitDetailSection';
import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

interface Props {
  promotionCampaign: PromotionCampaign;
}

export const PromotionDetailSection: React.FC<Props> = ({ promotionCampaign }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const canEdit = (status: PromotionCampaignStatusEnum) => {
    switch (status) {
      case PromotionCampaignStatusEnum.DRAFT:
      case PromotionCampaignStatusEnum.SCHEDULED:
      case PromotionCampaignStatusEnum.PAUSED:
        return true;
      case PromotionCampaignStatusEnum.INACTIVE:
        return true;
    }
  }

  return (
    <BaseDetailSection
      title={t('common.promotionDetails')}
      onEdit={canEdit(promotionCampaign.status)
        ? () => navigate(`/promotion-campaigns/${promotionCampaign.id}/edit`)
        : undefined}
    >
      {promotionCampaign.conditions.length > 0 && (
        <ConditionDetailSection conditions={promotionCampaign.conditions} />
      )}

      {promotionCampaign.rewards.length > 0 && (
        <RewardDetailSection rewards={promotionCampaign.rewards} />
      )}

      {promotionCampaign.limits.length > 0 && (
        <LimitDetailSection limits={promotionCampaign.limits} />
      )}
    </BaseDetailSection>
  );
};
