import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from 'antd';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

export const MobileView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PortalLayoutV2
      title={t('permission.addGroupPermissions')}
      onBack={() => navigate('/permissions')}
    >
      <Typography.Text type="secondary">
        {t('messages.thisFeatureIsNotAvailableOnMobile')}
      </Typography.Text>
    </PortalLayoutV2>
  );
};
