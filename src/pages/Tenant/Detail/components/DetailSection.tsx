import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { type Tenant } from '@shared/types/tenant';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  tenant: Tenant | undefined;
}

export const DetailSection: React.FC<Props> = ({ tenant }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <BaseDetailSection
      title={t('tenant.basicInformation')}
      loading={tenant === undefined}
      onEdit={() => navigate(`/tenants/${tenant?.id}/edit`)}
    >
      {tenant && (
        <>
          <DataWrapper title={t('common.name')} value={tenant.name} />
          <DataWrapper title={t('common.status')} >
            <DynamicTag value={tenant.status} type="text" />
          </DataWrapper>
        </>
      )}
    </BaseDetailSection>
  );
};
