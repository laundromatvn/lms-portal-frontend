import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Form,
  type FormInstance,
  notification,
} from 'antd';

import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';
import { type PromotionMetadata } from '@shared/types/promotion/PromotionMetadata';
import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';
import { type PromotionReward } from '@shared/types/promotion/PromotionReward';
import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';

import {
  useGetPromotionMetadataApi,
  type GetPromotionMetadataResponse
} from '@shared/hooks/promotion/useGetPromotionMetadataApi';

import { BaseEditSection } from '@shared/components/BaseEditSection';

import { ConditionEditSection } from './ConditionEditSection';
import { RewardEditSection } from './RewardEditSection';
import { LimitEditSection } from './LimitEditSection';

interface Props {
  promotionCampaign: PromotionCampaign;
  onSave: (form: FormInstance) => void;
}

export const PromotionDetailEditSection: React.FC<Props> = ({
  promotionCampaign,
  onSave,
}: Props) => {
  const { t } = useTranslation();
  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const [conditions, setConditions] = useState<PromotionCondition[]>([]);
  const [rewards, setRewards] = useState<PromotionReward[]>([]);
  const [limits, setLimits] = useState<PromotionLimit[]>([]);

  const {
    getPromotionMetadata,
    data: promotionMetadataData,
  } = useGetPromotionMetadataApi<GetPromotionMetadataResponse>();

  const handleOnSave = async () => {
    if (rewards.length === 0) {
      api.error({
        message: t('messages.promotionDetailMustHaveAtLeastOneReward'),
      });
      return;
    }

    form.setFieldsValue({
      name: promotionCampaign.name,
      description: promotionCampaign.description,
      status: promotionCampaign.status,
      start_time: promotionCampaign.start_time ? dayjs(promotionCampaign.start_time) : undefined,
      end_time: promotionCampaign.end_time ? dayjs(promotionCampaign.end_time) : undefined,
      conditions: conditions,
      rewards: rewards,
      limits: limits,
    });

    onSave(form);
  };

  useEffect(() => {
    getPromotionMetadata();
    setConditions(promotionCampaign.conditions);
    setRewards(promotionCampaign.rewards);
    setLimits(promotionCampaign.limits);
  }, [promotionCampaign]);

  return (
    <>
      {contextHolder}
      <BaseEditSection title={t('common.promotionDetails')} onSave={handleOnSave}>
        <ConditionEditSection
          conditionOptions={promotionMetadataData?.conditions || []}
          conditions={conditions}
          onChange={(conditions) => setConditions(conditions)}
        />

        <RewardEditSection
          rewardOptions={promotionMetadataData?.rewards || []}
          rewards={rewards}
          onChange={(rewards) => setRewards(rewards)}
        />

        <LimitEditSection
          limitOptions={promotionMetadataData?.limits || []}
          limits={limits}
          onChange={(limits) => setLimits(limits)}
        />
      </BaseEditSection>
    </>
  );
};
