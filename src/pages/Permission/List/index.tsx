import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';

import { PermissionListView } from './ListView';

export const PermissionListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PortalLayout title={t('navigation.permissions')} onBack={() => navigate(-1)}>
      <PermissionListView />
    </PortalLayout>
  );
};
