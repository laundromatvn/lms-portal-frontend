import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex } from 'antd';

import { useIsMobile } from '@shared/hooks/useIsMobile';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { PromotionCampaignListTable } from './Table';
import { PromotionCampaignListStack } from './Stack';

export const PromotionCampaignListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <PortalLayoutV2 title={t('common.promotionCampaign')} onBack={() => navigate(-1)}>
      <Flex vertical style={{ height: '100%' }}>
        {isMobile ? (
          <PromotionCampaignListStack />
        ) : (
          <PromotionCampaignListTable />
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
