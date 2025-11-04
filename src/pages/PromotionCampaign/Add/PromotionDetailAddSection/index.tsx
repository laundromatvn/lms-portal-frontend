import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Form,
  type FormInstance,
  notification,
} from 'antd';

import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';
import { type PromotionReward } from '@shared/types/promotion/PromotionReward';
import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';

import {
  useGetPromotionMetadataApi,
  type GetPromotionMetadataResponse
} from '@shared/hooks/promotion/useGetPromotionMetadataApi';

import { BaseEditSection } from '@shared/components/BaseEditSection';

import { ConditionAddSection } from './ConditionAddSection';
import { RewardAddSection } from './RewardAddSection';
import { LimitAddSection } from './LimitAddSection';

export interface PromotionDetailAddSectionRef {
  conditions: PromotionCondition[];
  rewards: PromotionReward[];
  limits: PromotionLimit[];
}

interface Props {
  addSectionFormRef: React.RefObject<FormInstance | null>;
  onRef?: (ref: PromotionDetailAddSectionRef | null) => void;
}

export const PromotionDetailAddSection: React.FC<Props> = ({
  addSectionFormRef,
  onRef,
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

  useEffect(() => {
    getPromotionMetadata();
  }, []);

  useEffect(() => {
    if (onRef) {
      onRef({ conditions, rewards, limits });
    }
  }, [conditions, rewards, limits, onRef]);

  return (
    <>
      {contextHolder}
      <BaseEditSection title={t('common.promotionDetails')} showSaveButton={false}>
        <ConditionAddSection
          conditionOptions={promotionMetadataData?.conditions || []}
          conditions={conditions}
          onChange={(conditions) => setConditions(conditions)}
        />

        <RewardAddSection
          rewardOptions={promotionMetadataData?.rewards || []}
          rewards={rewards}
          onChange={(rewards) => setRewards(rewards)}
        />

        <LimitAddSection
          limitOptions={promotionMetadataData?.limits || []}
          limits={limits}
          onChange={(limits) => setLimits(limits)}
        />
      </BaseEditSection>
    </>
  );
};
