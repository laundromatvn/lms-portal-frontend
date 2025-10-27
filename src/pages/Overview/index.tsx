import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Typography } from 'antd';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { KeyMetricsSection } from './KeyMetricsSection';
import { OrderByDayBarChartSection } from './OrderByDayBarChartSection';
import { RevenueByDayBarChartSection } from './RevenueByDayBarChartSection';
import { StoreListSection } from './StoreListSection';
import { OrderListSection } from './OrderListSection';

export const OverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <PortalLayout>
      <Flex vertical gap="large" style={{ width: '100%' }}>
        {!isMobile && <Typography.Title level={2}>{t('navigation.overview')}</Typography.Title>}

        <KeyMetricsSection />

        <OrderByDayBarChartSection />

        <RevenueByDayBarChartSection />

        <StoreListSection />

        <OrderListSection />
      </Flex>
    </PortalLayout>
  );
};
