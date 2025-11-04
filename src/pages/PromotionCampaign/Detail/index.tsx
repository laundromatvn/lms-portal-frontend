import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Flex, Skeleton, Typography, notification } from 'antd';

import {
  ArrowLeft,
  Calendar,
  PauseCircle,
  PlayCircle,
  TrashBinTrash,
} from '@solar-icons/react';

import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';

import { useTheme } from '@shared/theme/useTheme';

import { useGetPromotionCampaignApi } from '@shared/hooks/promotion/useGetPromotionCampaignApi';
import { useDeletePromotionCampaignApi } from '@shared/hooks/promotion/useDeletePromotionCampaignApi';
import { useSchedulePromotionCampaignApi } from '@shared/hooks/promotion/useSchedulePromotionCampaignApi';
import { usePausePromotionCampaignApi } from '@shared/hooks/promotion/usePausePromotionCampaignApi';
import { useResumePromotionCampaignApi } from '@shared/hooks/promotion/useResumePromotionCampaignApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';

import { DetailSection } from './DetailSection';
import { PromotionDetailSection } from './PromotionDetailSection';

export const PromotionCampaignDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const promotionCampaignId = useParams().id as string;

  const {
    getPromotionCampaign,
    loading: getPromotionCampaignLoading,
    error: getPromotionCampaignError,
    data: getPromotionCampaignData,
  } = useGetPromotionCampaignApi();
  const {
    deletePromotionCampaign,
    data: deletePromotionCampaignData,
    error: deletePromotionCampaignError,
    loading: deletePromotionCampaignLoading,
  } = useDeletePromotionCampaignApi<void>();
  const {
    pausePromotionCampaign,
    data: pausePromotionCampaignData,
    error: pausePromotionCampaignError,
    loading: pausePromotionCampaignLoading,
  } = usePausePromotionCampaignApi();
  const {
    resumePromotionCampaign,
    data: resumePromotionCampaignData,
    error: resumePromotionCampaignError,
    loading: resumePromotionCampaignLoading,
  } = useResumePromotionCampaignApi();
  const {
    schedulePromotionCampaign,
    data: schedulePromotionCampaignData,
    error: schedulePromotionCampaignError,
    loading: schedulePromotionCampaignLoading,
  } = useSchedulePromotionCampaignApi();

  useEffect(() => {
    if (promotionCampaignId) {
      getPromotionCampaign(promotionCampaignId);
    }
  }, [promotionCampaignId]);

  useEffect(() => {
    if (getPromotionCampaignError) {
      api.error({
        message: t('messages.getPromotionCampaignError'),
      });
    }
  }, [getPromotionCampaignError]);

  useEffect(() => {
    if (deletePromotionCampaignData) {
      api.success({
        message: t('messages.deletePromotionCampaignSuccess'),
      });
      navigate('/promotion-campaigns');
    }
  }, [deletePromotionCampaignData]);

  useEffect(() => {
    if (deletePromotionCampaignError) {
      api.error({
        message: t('messages.deletePromotionCampaignError'),
      });
    }
  }, [deletePromotionCampaignError]);

  useEffect(() => {
    if (pausePromotionCampaignData) {
      api.success({
        message: t('messages.pausePromotionCampaignSuccess'),
      });
      getPromotionCampaign(promotionCampaignId);
    }
  }, [pausePromotionCampaignData]);

  useEffect(() => {
    if (pausePromotionCampaignError) {
      api.error({
        message: t('messages.pausePromotionCampaignError'),
      });
    }
  }, [pausePromotionCampaignError]);

  useEffect(() => {
    if (resumePromotionCampaignData) {
      api.success({
        message: t('messages.resumePromotionCampaignSuccess'),
      });
      getPromotionCampaign(promotionCampaignId);
    }
  }, [resumePromotionCampaignData]);

  useEffect(() => {
    if (resumePromotionCampaignError) {
      api.error({
        message: t('messages.resumePromotionCampaignError'),
      });
    }
  }, [resumePromotionCampaignError]);

  useEffect(() => {
    if (schedulePromotionCampaignData) {
      api.success({
        message: t('messages.schedulePromotionCampaignSuccess'),
      });
      getPromotionCampaign(promotionCampaignId);
    }
  }, [schedulePromotionCampaignData]);

  useEffect(() => {
    if (schedulePromotionCampaignError) {
      api.error({
        message: t('messages.schedulePromotionCampaignError'),
      });
    }
  }, [schedulePromotionCampaignError]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('common.promotionCampaignDetail')}</Typography.Title>

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
          right={!getPromotionCampaignLoading && getPromotionCampaignData ? (
            <Flex justify="end" gap={theme.custom.spacing.small} wrap="wrap">
              <Button
                type="default"
                icon={<Calendar weight="Outline" />}
                onClick={() => schedulePromotionCampaign(promotionCampaignId)}
                loading={schedulePromotionCampaignLoading}
                style={{
                  borderColor: theme.custom.colors.info.default,
                  color: theme.custom.colors.info.default,
                  backgroundColor: theme.custom.colors.background.light,
                }}
              >
                {t('common.schedule')}
              </Button>
              <Button
                type="default"
                icon={<PauseCircle weight="Outline" />}
                onClick={() => pausePromotionCampaign(promotionCampaignId)}
                loading={pausePromotionCampaignLoading}
                style={{
                  borderColor: theme.custom.colors.warning.default,
                  color: theme.custom.colors.warning.default,
                  backgroundColor: theme.custom.colors.background.light,
                }}
              >
                {t('common.pause')}
              </Button>
              <Button
                type="default"
                icon={<PlayCircle weight="Outline" />}
                onClick={() => resumePromotionCampaign(promotionCampaignId)}
                loading={resumePromotionCampaignLoading}
                style={{
                  borderColor: theme.custom.colors.success.default,
                  color: theme.custom.colors.success.default,
                  backgroundColor: theme.custom.colors.background.light,
                }}
              >
                {t('common.resume')}
              </Button>
              <Button
                type="primary"
                danger
                icon={<TrashBinTrash weight="Outline" />}
                onClick={() => deletePromotionCampaign(promotionCampaignId)}
                loading={deletePromotionCampaignLoading}
              >
                {t('common.delete')}
              </Button>
            </Flex>
          ) : null}
        />

        {getPromotionCampaignLoading && <Skeleton active />}

        {!getPromotionCampaignLoading && getPromotionCampaignData && (
          <>
            <DetailSection promotionCampaign={getPromotionCampaignData as PromotionCampaign} />

            <PromotionDetailSection promotionCampaign={getPromotionCampaignData as PromotionCampaign} />
          </>
        )}
      </Flex>
    </PortalLayout>
  );
};
