import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Button,
  Flex,
  Skeleton,
  notification,
  Dropdown,
  type MenuProps,
} from 'antd';

import {
  AltArrowDown,
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

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import LeftRightSection from '@shared/components/LeftRightSection';

import { DetailSection } from './DetailSection';
import { PromotionDetailSection } from './PromotionDetailSection';
import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

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
    <PortalLayoutV2 title={getPromotionCampaignData?.name} onBack={() => navigate(-1)}>
      {contextHolder}
      {!getPromotionCampaignLoading && getPromotionCampaignData && (
        <Flex justify="end" style={{ width: '100%' }}>
          <Dropdown
            trigger={['click']}
            disabled={getPromotionCampaignData?.status === PromotionCampaignStatusEnum.FINISHED}
            menu={{
              items: [
                {
                  key: 'schedule',
                  label: t('common.schedule'),
                  onClick: () => schedulePromotionCampaign(promotionCampaignId),
                  icon: <Calendar weight="Outline" />,
                  disabled: schedulePromotionCampaignLoading,
                },
                {
                  key: 'pause',
                  label: t('common.pause'),
                  onClick: () => pausePromotionCampaign(promotionCampaignId),
                  icon: <PauseCircle weight="Outline" />,
                  disabled: pausePromotionCampaignLoading,
                },
                {
                  key: 'resume',
                  label: t('common.resume'),
                  onClick: () => resumePromotionCampaign(promotionCampaignId),
                  icon: <PlayCircle weight="Outline" />,
                  disabled: resumePromotionCampaignLoading,
                },
                {
                  key: 'delete',
                  label: t('common.delete'),
                  onClick: () => deletePromotionCampaign(promotionCampaignId),
                  icon: <TrashBinTrash weight="Outline" />,
                  style: { color: theme.custom.colors.danger.default },
                  disabled: deletePromotionCampaignLoading,
                },
              ] as MenuProps['items'],
            }}
          >
            <Button
              icon={<AltArrowDown />}
              loading={
                schedulePromotionCampaignLoading ||
                pausePromotionCampaignLoading ||
                resumePromotionCampaignLoading ||
                deletePromotionCampaignLoading
              }
              style={{
                backgroundColor: theme.custom.colors.background.light,
                color: theme.custom.colors.neutral.default,
              }}
            >
              {t('common.actions')}
            </Button>
          </Dropdown>
        </Flex>
      )}

      {getPromotionCampaignLoading && <Skeleton active />}

      {!getPromotionCampaignLoading && getPromotionCampaignData && (
        <Flex
          vertical={true}
          gap={theme.custom.spacing.medium}
          style={{ width: '100%', height: '100%', marginTop: theme.custom.spacing.medium }}
        >
          <DetailSection promotionCampaign={getPromotionCampaignData as PromotionCampaign} />

          <PromotionDetailSection promotionCampaign={getPromotionCampaignData as PromotionCampaign} />
        </Flex>
      )}
    </PortalLayoutV2>
  );
};
