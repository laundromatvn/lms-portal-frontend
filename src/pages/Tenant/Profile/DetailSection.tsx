import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { type Tenant } from '@shared/types/tenant';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  tenant: Tenant;
}

export const DetailSection: React.FC<Props> = ({ tenant }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <BaseDetailSection title={t('common.basicInformation')} onEdit={() => navigate(`/tenants/${tenant.id}/edit`)}>
      <DataWrapper title={t('common.tenantId')} value={tenant.id || '-'} />
      <DataWrapper title={t('common.name')} value={tenant.name || '-'} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={tenant.status} />
      </DataWrapper>
      <DataWrapper title={t('common.contactEmail')} value={tenant.contact_email || '-'} />
      <DataWrapper title={t('common.contactPhoneNumber')} value={tenant.contact_phone_number || '-'} />
      <DataWrapper title={t('common.contactFullName')} value={tenant.contact_full_name || '-'} />
      <DataWrapper title={t('common.contactAddress')} value={tenant.contact_address || '-'} />
    </BaseDetailSection>
  );
};
