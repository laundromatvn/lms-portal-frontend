import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from 'antd';

import { type Controller } from '@shared/types/Controller';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  controller: Controller;
}

export const DetailSection: React.FC<Props> = ({ controller }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <BaseDetailSection title={t('common.basicInformation')} onEdit={() => navigate(`/controllers/${controller.id}/edit`)}>
      <DataWrapper title={t('common.deviceId')} value={controller.device_id || '-'} />
      <DataWrapper title={t('common.store')} value={controller.store_name || '-'} />
      <DataWrapper title={t('common.name')} value={controller.name || '-'} />
      <DataWrapper title={t('common.totalRelays')} value={controller.total_relays || '-'} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={controller.status} />
      </DataWrapper>
      <DataWrapper title={t('common.firmware')}>
        <Typography.Link
          onClick={() => navigate(`/firmware/${controller.firmware_id}/detail`)}
          style={{ cursor: 'pointer' }}
        >
          {`${controller.firmware_name} (${controller.firmware_version})` || '-'}
        </Typography.Link>
      </DataWrapper>
    </BaseDetailSection>
  );
};
