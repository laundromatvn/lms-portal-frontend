import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';

import { PromotionCampaignListTable } from './Table';
import { PromotionCampaignListStack } from './Stack';

export const PromotionCampaignListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const isMobile = useIsMobile();


  return (
    <PortalLayout>
      <Flex vertical style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('common.promotionCampaign')}</Typography.Title>

        {isMobile ? (
          <PromotionCampaignListStack />
        ) : (
          <PromotionCampaignListTable />
        )}
      </Flex>
    </PortalLayout>
  );
};
