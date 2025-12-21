import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PortalLayoutV2
      title={t('common.addTenant')}
      onBack={() => navigate(-1)}
    >
      {t('messages.comingSoon')}
    </PortalLayoutV2>
  );
};
