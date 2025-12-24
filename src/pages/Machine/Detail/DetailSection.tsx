import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from 'antd';

import { type Machine } from '@shared/types/machine';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  machine: Machine;
}

export const DetailSection: React.FC<Props> = ({ machine }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <BaseDetailSection title={t('common.basicInformation')} onEdit={() => navigate(`/machines/${machine.id}/edit`)}>
      <DataWrapper title={t('common.name')} value={machine.name || '-'} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={machine.status} />
      </DataWrapper>
      <DataWrapper title={t('common.controllerId')}>
        <Typography.Link
          onClick={() => navigate(`/controllers/${machine.controller_id}/detail`)}
          style={{ cursor: 'pointer' }}
        >
          {machine.controller_device_id || t('common.unknown')}
        </Typography.Link>
      </DataWrapper>
      <DataWrapper title={t('common.relayNo')} value={machine.relay_no} />
      <DataWrapper title={t('common.store')}>
        <Typography.Link
          onClick={() => navigate(`/stores/${machine.store_id}/detail`)}
          style={{ cursor: 'pointer' }}
          disabled={!machine.store_id}
        >
          {machine.store_name || '-'}
        </Typography.Link>
      </DataWrapper>
    </BaseDetailSection>
  );
};
