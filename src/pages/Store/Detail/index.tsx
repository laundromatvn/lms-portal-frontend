import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Typography } from 'antd';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';

export const StoreDetailPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PortalLayout>
      <Flex vertical justify="center" align="center" style={{ height: '100%' }}>
        <Typography.Title level={2}>Store Detail</Typography.Title>
        <Typography.Text type="secondary">{t('messages.thisPageWillBeUpdatedSoon')}</Typography.Text>
      </Flex>
    </PortalLayout>
  );
};
