import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Machine } from '@shared/types/machine';

import { Box } from '@shared/components/Box';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  machine: Machine;
}

export const DetailSection: React.FC<Props> = ({ machine }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <DataWrapper title={t('common.machineId')} value={machine.id} />
      <DataWrapper title={t('common.name')} value={machine.name || '-'} />
      <DataWrapper title={t('common.controllerId')}>
        <Typography.Link
          onClick={() => navigate(`/controllers/${machine.controller_id}/detail`)}
          style={{ cursor: 'pointer' }}
        >
          {machine.controller_id}
        </Typography.Link>
      </DataWrapper>
      <DataWrapper title={t('common.relayNo')} value={machine.relay_no} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={machine.status} />
      </DataWrapper>
      <DataWrapper title={t('common.machineType')} value={machine.machine_type} />
      <DataWrapper title={t('common.basePrice')} value={machine.base_price || '-'} />
      <DataWrapper title={t('common.store')}>
        <Typography.Link
          onClick={() => navigate(`/stores/${machine.store_id}/detail`)}
          style={{ cursor: 'pointer' }}
          disabled={!machine.store_id}
        >
          {machine.store_name || '-'}
        </Typography.Link>
      </DataWrapper>
    </Box>
  );
};
