import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useCan } from '@shared/hooks/useCan';

import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';
import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { ConditionDetailSection } from './ConditionDetailSection';
import { RewardDetailSection } from './RewardDetailSection';
import { LimitDetailSection } from './LimitDetailSection';

interface Props {
  promotionCampaign: PromotionCampaign;
}

export const PromotionDetailSection: React.FC<Props> = ({ promotionCampaign }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const can = useCan();
  
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
      onEdit={(can('promotion_campaign.update') && canEdit(promotionCampaign.status))
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
