import React from 'react';
import { useTranslation } from 'react-i18next';

import { type Tenant } from '@shared/types/tenant';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';

interface Props {
  tenant: Tenant;
}

export const ContactInformationSection: React.FC<Props> = ({ tenant }: Props) => {
  const { t } = useTranslation();

  return (
    <BaseDetailSection title={t('tenant.contactInformation')} loading={tenant === undefined}>
      {tenant && (
        <>
          <DataWrapper title={t('common.contactEmail')} value={tenant.contact_email} />
          <DataWrapper title={t('common.contactPhoneNumber')} value={tenant.contact_phone_number} />
          <DataWrapper title={t('common.contactFullName')} value={tenant.contact_full_name} />
          <DataWrapper title={t('common.contactAddress')} value={tenant.contact_address} />
        </>
      )}
    </BaseDetailSection>
  );
};
