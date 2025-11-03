import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Flex, Skeleton, Typography, notification } from 'antd';


import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';

import { useTheme } from '@shared/theme/useTheme';

import { useGetPromotionCampaignApi } from '@shared/hooks/promotion/useGetPromotionCampaignApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';

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

  useEffect(() => {
    if (promotionCampaignId) {
      getPromotionCampaign(promotionCampaignId);
    }
  }, [promotionCampaignId]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('common.promotionCampaignDetail')}</Typography.Title>

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
