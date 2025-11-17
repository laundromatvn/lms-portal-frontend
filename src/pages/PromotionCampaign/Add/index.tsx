import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import {
  Button,
  Flex,
  notification,
  type FormInstance,
} from 'antd';

import { AddCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useCreatePromotionCampaignApi,
  type CreatePromotionCampaignResponse,
} from '@shared/hooks/promotion/useCreatePromotionCampaignApi';

import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { AddSection } from './AddSection';
import { PromotionDetailAddSection, type PromotionDetailAddSectionRef } from './PromotionDetailAddSection';

export const PromotionCampaignAddPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const {
    createPromotionCampaign,
    data: createPromotionCampaignData,
    loading: createPromotionCampaignLoading,
    error: createPromotionCampaignError,
  } = useCreatePromotionCampaignApi<CreatePromotionCampaignResponse>();

  const addSectionFormRef = useRef<FormInstance | null>(null);
  const [promotionDetailRef, setPromotionDetailRef] = useState<PromotionDetailAddSectionRef | null>(null);

  const handleSave = async () => {
    if (!addSectionFormRef.current) {
      return;
    }

    try {
      await addSectionFormRef.current.validateFields();
    } catch (error) {
      return;
    }

    const name = addSectionFormRef.current.getFieldValue('name');
    const description = addSectionFormRef.current.getFieldValue('description');
    const startTime = addSectionFormRef.current.getFieldValue('start_time');
    const endTime = addSectionFormRef.current.getFieldValue('end_time');

    const conditions = promotionDetailRef?.conditions || [];
    const rewards = promotionDetailRef?.rewards || [];
    const limits = promotionDetailRef?.limits || [];

    if (rewards.length === 0) {
      api.error({
        message: t('messages.promotionDetailMustHaveAtLeastOneReward'),
      });
      return;
    }

    const payload = {
      name: name,
      description: description,
      status: PromotionCampaignStatusEnum.DRAFT,
      start_time: startTime ? dayjs(startTime).format('YYYY-MM-DD HH:mm:ss') : '',
      end_time: endTime ? dayjs(endTime).format('YYYY-MM-DD HH:mm:ss') : null,
      conditions: conditions,
      rewards: rewards,
      limits: limits,
    }

    createPromotionCampaign(payload);
  }

  useEffect(() => {
    if (createPromotionCampaignError) {
      api.error({
        message: t('messages.createPromotionCampaignError'),
      });
    }
  }, [createPromotionCampaignError]);

  useEffect(() => {
    if (createPromotionCampaignData) {
      api.success({
        message: t('messages.createPromotionCampaignSuccess'),
      });

      navigate(`/promotion-campaigns/${createPromotionCampaignData.id}/detail`);
    }
  }, [createPromotionCampaignData]);

  return (
    <PortalLayout title={t('common.promotionCampaignAdd')} onBack={() => navigate(-1)}>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <LeftRightSection
          left={null}
          right={(
            <Button
              type="primary"
              icon={<AddCircle size={18} />}
              onClick={handleSave}
              loading={createPromotionCampaignLoading}
            >
              {t('common.add')}
            </Button>
          )}
        />

        <AddSection
          formRef={addSectionFormRef}
        />

        <PromotionDetailAddSection
          addSectionFormRef={addSectionFormRef}
          onRef={setPromotionDetailRef}
        />
      </Flex>
    </PortalLayout>
  );
};

