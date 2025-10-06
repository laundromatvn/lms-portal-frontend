import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@shared/theme/useTheme';

import { type Tenant } from '@shared/types/tenant';

import { Box } from '@shared/components/Box';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  tenant: Tenant;
}

export const DetailSection: React.FC<Props> = ({ tenant }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <DataWrapper title={t('common.deviceId')} value={tenant.id || '-'} />
      <DataWrapper title={t('common.name')} value={tenant.name || '-'} />
      <DataWrapper title={t('common.contactEmail')} value={tenant.contact_email || '-'} />
      <DataWrapper title={t('common.contactPhoneNumber')} value={tenant.contact_phone_number || '-'} />
      <DataWrapper title={t('common.contactFullName')} value={tenant.contact_full_name || '-'} />
      <DataWrapper title={t('common.contactAddress')} value={tenant.contact_address || '-'} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={tenant.status} />
      </DataWrapper>
    </Box>
  );
};
