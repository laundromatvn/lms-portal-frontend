import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, Dropdown, Button } from 'antd';

import {
  AltArrowDown,
  Rocket2,
  ArchiveDown,
  TrashBinTrash,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { type Firmware } from '@shared/types/Firmware';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  firmware: Firmware | null;
  releaseFirmware: (firmwareId: string) => void;
  deprecateFirmware: (firmwareId: string) => void;
  deleteFirmware: (firmwareId: string) => void;
  firmwareLoading: boolean;
}

export const BasicInformationSection: React.FC<Props> = ({
  firmware,
  releaseFirmware,
  deprecateFirmware,
  deleteFirmware,
  firmwareLoading,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useIsMobile();

  if (!firmware) {
    return null;
  }

  return (
    <>
      <Flex justify="end" gap={theme.custom.spacing.small}>
        <Dropdown
          menu={{
            items: [
              {
                key: 'release',
                label: t('common.release'),
                onClick: () => releaseFirmware(firmware.id),
                icon: <Rocket2 />,
              },
              {
                key: 'deprecate',
                label: t('common.deprecate'),
                onClick: () => deprecateFirmware(firmware.id),
                icon: <ArchiveDown />,
              },
              {
                key: 'delete',
                label: t('common.delete'),
                onClick: () => deleteFirmware(firmware.id),
                icon: <TrashBinTrash />,
                style: { color: theme.custom.colors.danger.default },
              },
            ],
          }}
        >
          <Button
            size={isMobile ? 'large' : 'middle'}
            type="default"
            icon={<AltArrowDown />}
            loading={firmwareLoading}
            style={{
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          >
            {t('common.actions')}
          </Button>
        </Dropdown>
      </Flex>

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{
          width: '100%',
          height: '100%',
          marginTop: theme.custom.spacing.medium,
        }}
      >
        <BaseDetailSection title={t('common.basicInformation')} onEdit={() => navigate(`/firmware/${firmware.id}/edit`)}>
          <DataWrapper title={t('common.name')} value={firmware.name || '-'} />
          <DataWrapper title={t('common.version')} value={firmware.version || '-'} />
          <DataWrapper title={t('common.description')} value={firmware.description || '-'} />
          <DataWrapper title={t('common.status')} >
            <DynamicTag value={firmware.status} type="text" />
          </DataWrapper>
          <DataWrapper title={t('common.versionType')}>
            <DynamicTag value={firmware.version_type} type="text" />
          </DataWrapper>
          <DataWrapper title={t('common.objectName')} value={firmware.object_name || '-'} />
          <DataWrapper title={t('common.fileSize')} value={firmware.file_size || '-'} />
          <DataWrapper title={t('common.checksum')} value={firmware.checksum || '-'} />
        </BaseDetailSection>
      </Flex>
    </>
  );
};
