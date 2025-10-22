import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { type Store } from '@shared/types/store';

import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';
import { EditSection } from '@shared/components/EditSection';


interface Props {
  store: Store;
}

export const DetailSection: React.FC<Props> = ({ store }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <EditSection title={t('common.basicInformation')} onEdit={() => navigate(`/stores/${store.id}/edit`)}>
      <DataWrapper title={t('common.name')} value={store.name || '-'} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={store.status} />
      </DataWrapper>
      <DataWrapper title={t('common.address')} value={store.address || '-'} />
      <DataWrapper title={t('common.contactPhoneNumber')} value={store.contact_phone_number || '-'} />
    </EditSection>
  );
};
