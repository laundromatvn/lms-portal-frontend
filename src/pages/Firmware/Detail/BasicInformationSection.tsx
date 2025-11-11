import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { type Firmware } from '@shared/types/Firmware';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  firmware: Firmware | null;
}

export const BasicInformationSection: React.FC<Props> = ({ firmware }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!firmware) {
    return null;
  }

  return (
    <BaseDetailSection title={t('common.basicInformation')} onEdit={() => navigate(`/firmware/${firmware.id}/edit`)}>
      <DataWrapper title={t('common.name')} value={firmware.name || '-'} />
      <DataWrapper title={t('common.version')} value={firmware.version || '-'} />
      <DataWrapper title={t('common.description')} value={firmware.description || '-'} />
      <DataWrapper title={t('common.status')} >
        <DynamicTag value={firmware.status} />
      </DataWrapper>
      <DataWrapper title={t('common.versionType')}>
        <DynamicTag value={firmware.version_type} />
      </DataWrapper>
      <DataWrapper title={t('common.objectName')} value={firmware.object_name || '-'} />
      <DataWrapper title={t('common.fileSize')} value={firmware.file_size || '-'} />
      <DataWrapper title={t('common.checksum')} value={firmware.checksum || '-'} />
    </BaseDetailSection>
  );
};
