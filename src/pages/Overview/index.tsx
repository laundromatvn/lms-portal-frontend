import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Typography } from 'antd';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';

import { KeyMetricsSection } from './KeyMetricsSection';
import { OrderByDayBarChartSection } from './OrderByDayBarChartSection';
import { RevenueByDayBarChartSection } from './RevenueByDayBarChartSection';
import { StoreKeyMetricsSection } from './StoreKeyMetricsSection';
import { OverviewOrderTableSection } from './OrderTableSection/index';
import { MachineStatusLineChartSection } from './MachineStatusLineChartSection';

export const OverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <PortalLayout>
      <Flex vertical gap="large" style={{ width: '100%' }}>
        <Typography.Title level={2}>{t('navigation.overview')}</Typography.Title>

        <KeyMetricsSection />

        <OrderByDayBarChartSection />

        <RevenueByDayBarChartSection />

        {!isMobile && <StoreKeyMetricsSection />}

        {!isMobile && <OverviewOrderTableSection />}
        
        {!isMobile && <MachineStatusLineChartSection />}
      </Flex>
    </PortalLayout>
  );
};
