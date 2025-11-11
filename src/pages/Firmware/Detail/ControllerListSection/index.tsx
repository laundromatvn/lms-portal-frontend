import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import type { Firmware } from '@shared/types/Firmware';

import {
  useListProvisionedControllerApi,
  type ListProvisionedControllerResponse,
} from '@shared/hooks/firmware/useListProvisionedControllerApi';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { ControllerListTableView } from './Table';

interface Props {
  firmware: Firmware | null;
}

export const ControllerListSection: React.FC<Props> = ({ firmware }: Props) => {
  const { t } = useTranslation();

  return (
    <BaseDetailSection title={t('common.provisionedControllers')}>
      <ControllerListTableView firmware={firmware} />
    </BaseDetailSection>
  );
};
