import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useCan } from '@shared/hooks/useCan';

import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatDateTime } from '@shared/utils/date';
import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

interface Props {
  promotionCampaign: PromotionCampaign;
}

export const DetailSection: React.FC<Props> = ({ promotionCampaign }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const can = useCan();

  const canEdit = (status: PromotionCampaignStatusEnum) => {
    switch (status) {
      case PromotionCampaignStatusEnum.DRAFT:
      case PromotionCampaignStatusEnum.SCHEDULED:
      case PromotionCampaignStatusEnum.PAUSED:
        return true;
      default:
        return false;
    }
  }

  return (
    <BaseDetailSection
      title={t('common.basicInformation')}
      onEdit={(can('promotion_campaign.update') && canEdit(promotionCampaign.status))
        ? () => navigate(`/promotion-campaigns/${promotionCampaign.id}/edit`)
        : undefined}
    >
      <DataWrapper title={t('common.name')} value={promotionCampaign.name || '-'} />
      <DataWrapper title={t('common.description')} value={promotionCampaign.description || '-'} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={promotionCampaign.status} />
      </DataWrapper>
      <DataWrapper title={t('common.startTime')} value={formatDateTime(promotionCampaign.start_time)} />
      <DataWrapper title={t('common.endTime')} value={promotionCampaign.end_time ? formatDateTime(promotionCampaign.end_time) : '-'} />
    </BaseDetailSection>
  );
};
