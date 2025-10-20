import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Typography } from 'antd';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';

import { KeyMetricsSection } from './KeyMetricsSection';
import { OrderByDayBarChartSection } from './OrderByDayBarChartSection';

export const OverviewPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PortalLayout>
      <Flex vertical gap="large" style={{ width: '100%' }}>
        <Typography.Title level={2}>{t('navigation.overview')}</Typography.Title>

        <KeyMetricsSection />
        <OrderByDayBarChartSection />
      </Flex>
    </PortalLayout>
  );
};
