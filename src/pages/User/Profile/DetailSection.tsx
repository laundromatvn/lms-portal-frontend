import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { userStorage } from '@core/storage/userStorage';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

export const UserProfileDetailSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = userStorage.load();

  return (
    <BaseDetailSection title={t('common.basicInformation')} onEdit={() => navigate(`/user/edit`)}>
      <DataWrapper title={t('common.email')} value={user?.email || '-'} />
      <DataWrapper title={t('common.phone')} value={user?.phone || '-'} />
      <DataWrapper title={t('common.role')}>
        <DynamicTag value={user?.role || '-'} />
      </DataWrapper>
    </BaseDetailSection>
  );
};
