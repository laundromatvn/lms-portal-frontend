import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from 'antd';

import { useCan } from '@shared/hooks/useCan';

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
  const can = useCan();

  return (
    <BaseDetailSection
      title={t('common.basicInformation')}
      onEdit={can('controller.update')
        ? () => navigate(`/controllers/${controller.id}/edit`)
        : undefined}
    >
      <DataWrapper title={t('common.deviceId')} value={controller.device_id || '-'} />
      <DataWrapper title={t('common.name')} value={controller.name || '-'} />
      <DataWrapper title={t('common.totalRelays')} value={controller.total_relays || '-'} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={controller.status} />
      </DataWrapper>
      <DataWrapper title={t('common.firmware')}>
        {controller.firmware_id ? (
          <Typography.Link
            onClick={() => navigate(`/firmware/${controller.firmware_id}/detail`)}
            style={{ cursor: 'pointer' }}
          >
            {controller.firmware_name} ({controller.firmware_version})
          </Typography.Link>
        ) : (
          <Typography.Text type="secondary">{t('common.unknown')}</Typography.Text>
        )}
      </DataWrapper>
      <DataWrapper title={t('common.store')} value={controller.store_name || '-'} />
    </BaseDetailSection>
  );
};
