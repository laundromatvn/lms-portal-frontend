import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { PermissionListView } from './ListView';

export const PermissionListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PortalLayoutV2 title={t('navigation.permissions')} onBack={() => navigate(-1)}>
      <PermissionListView />
    </PortalLayoutV2>
  );
};
