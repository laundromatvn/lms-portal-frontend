import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { type Machine } from '@shared/types/machine';

import { formatCurrencyCompact } from '@shared/utils/currency';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  machine: Machine;
}

export const MachineConfigSection: React.FC<Props> = ({ machine }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <BaseDetailSection title={t('common.machineConfig')} onEdit={() => navigate(`/machines/${machine.id}/edit`)}>
      <DataWrapper title={t('common.relayNo')} value={machine.relay_no} />
      <DataWrapper title={t('common.machineType')} value={<DynamicTag value={machine.machine_type} />} />
      <DataWrapper title={t('common.basePrice')} value={formatCurrencyCompact(machine.base_price)} />
      <DataWrapper title={t('common.pulseDuration')} value={machine.pulse_duration} />
      <DataWrapper title={t('common.coinValue')} value={machine.coin_value} />
    </BaseDetailSection>
  );
};
