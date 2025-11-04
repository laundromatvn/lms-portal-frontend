import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import {
  Button,
  Flex,
  Typography,
  Skeleton,
  notification,
  type FormInstance,
} from 'antd';

import { ArrowLeft } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useGetPromotionCampaignApi,
  type GetPromotionCampaignResponse,
} from '@shared/hooks/promotion/useGetPromotionCampaignApi';
import {
  useUpdatePromotionCampaignApi,
  type UpdatePromotionCampaignResponse,
} from '@shared/hooks/promotion/useUpdatePromotionCampaignApi';

import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { EditSection } from './EditSection';
import { PromotionDetailEditSection } from './PromotionDetailEditSection';

export const PromotionCampaignEditPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const promotionCampaignId = useParams().id as string;

  const {
    getPromotionCampaign,
    data: promotionCampaignData,
    loading: promotionCampaignLoading,
    error: promotionCampaignError,
  } = useGetPromotionCampaignApi<GetPromotionCampaignResponse>();
  const {
    updatePromotionCampaign,
    data: updatePromotionCampaignData,
    error: updatePromotionCampaignError,
  } = useUpdatePromotionCampaignApi<UpdatePromotionCampaignResponse>();

  const onSave = (form: FormInstance) => {
    const startTime = form.getFieldValue('start_time');
    const endTime = form.getFieldValue('end_time');

    const payload = {
      name: form.getFieldValue('name'),
      description: form.getFieldValue('description'),
      status: form.getFieldValue('status'),
      start_time: startTime ? dayjs(startTime).format('YYYY-MM-DD HH:mm:ss') : '',
      end_time: endTime ? dayjs(endTime).format('YYYY-MM-DD HH:mm:ss') : null,
      conditions: form.getFieldValue('conditions'),
      rewards: form.getFieldValue('rewards'),
      limits: form.getFieldValue('limits'),
    }

    updatePromotionCampaign(promotionCampaignId, payload);
  }

  useEffect(() => {
    if (promotionCampaignError) {
      api.error({
        message: t('messages.getPromotionCampaignError'),
      });
    }
  }, [promotionCampaignError]);

  useEffect(() => {
    if (updatePromotionCampaignError) {
      api.error({
        message: t('messages.updatePromotionCampaignError'),
      });
    }
  }, [updatePromotionCampaignError]);

  useEffect(() => {
    if (updatePromotionCampaignData) {
      api.success({
        message: t('messages.updatePromotionCampaignSuccess'),
      });

      navigate(`/promotion-campaigns/${promotionCampaignId}/detail`);
    }
  }, [updatePromotionCampaignData]);

  useEffect(() => {
    if (promotionCampaignId) {
      getPromotionCampaign(promotionCampaignId);
    }
  }, [promotionCampaignId]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('common.promotionCampaignEdit')}</Typography.Title>

        <LeftRightSection
          left={(
            <Button
              type="link"
              icon={<ArrowLeft color={theme.custom.colors.text.primary} />}
              onClick={() => navigate(-1)}
            >
              {t('common.back')}
            </Button>
          )}
          right={null}
        />

        {promotionCampaignLoading && <Skeleton active />}

        {!promotionCampaignLoading && promotionCampaignData && (
          <>
            <EditSection
              promotionCampaign={promotionCampaignData as PromotionCampaign}
              onSave={onSave}
            />
            <PromotionDetailEditSection
              promotionCampaign={promotionCampaignData as PromotionCampaign}
              onSave={onSave}
            />
          </>
        )}
      </Flex>
    </PortalLayout>
  );
};
