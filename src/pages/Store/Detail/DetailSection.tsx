import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@shared/theme/useTheme';

import { type Store } from '@shared/types/store';

import { Box } from '@shared/components/Box';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  store: Store;
}

export const DetailSection: React.FC<Props> = ({ store }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <DataWrapper title={t('common.name')} value={store.id} />
      <DataWrapper title={t('common.name')} value={store.name || '-'} />
      <DataWrapper title={t('common.address')} value={store.address || '-'} />
      <DataWrapper title={t('common.longitude')} value={store.longitude?.toString() || '-'} />
      <DataWrapper title={t('common.latitude')} value={store.latitude?.toString() || '-'} />
      <DataWrapper title={t('common.contactPhoneNumber')} value={store.contact_phone_number || '-'} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={store.status} />
      </DataWrapper>
    </Box>
  );
};
