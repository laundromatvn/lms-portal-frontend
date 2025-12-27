import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from 'antd';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

export const MobileView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseDetailSection
      title={t('navigation.subscriptionPlans')}
    >
      <Typography.Text type="secondary">
        {t('messages.thisFeatureIsNotAvailableOnMobile')}
      </Typography.Text>
    </BaseDetailSection>
  );
};
