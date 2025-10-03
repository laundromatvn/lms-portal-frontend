import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@shared/theme/useTheme';

import { type Controller } from '@shared/types/Controller';

import { Box } from '@shared/components/Box';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  controller: Controller;
}

export const DetailSection: React.FC<Props> = ({ controller }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <DataWrapper title={t('common.deviceId')} value={controller.device_id || '-'} />
      <DataWrapper title={t('common.store')} value={controller.store_name || '-'} />
      <DataWrapper title={t('common.name')} value={controller.name || '-'} />
      <DataWrapper title={t('common.totalRelays')} value={controller.total_relays || '-'} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={controller.status} />
      </DataWrapper>
    </Box>
  );
};
