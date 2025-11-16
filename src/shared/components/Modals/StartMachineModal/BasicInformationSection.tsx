import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Machine } from '@shared/types/machine';

import { Box } from '@shared/components/Box';

import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  machine: Machine;
}

export const StartMachineModalBasicInformationSection: React.FC<Props> = ({ machine }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <Typography.Text strong>{t('common.basicInformation')}</Typography.Text>

      <Typography.Text type="secondary">
        {t('common.name')}: <Typography.Text >{machine.name || "-"}</Typography.Text>
      </Typography.Text>
      <Typography.Text type="secondary">
        {t('common.machineType')}: <Typography.Text >{machine.machine_type}</Typography.Text>
      </Typography.Text>
      <Typography.Text type="secondary">
        {t('common.basePrice')}: <Typography.Text >{formatCurrencyCompact(machine.base_price)}</Typography.Text>
      </Typography.Text>
      <Typography.Text type="secondary">
        {t('common.coinValue')}: <Typography.Text >{machine.coin_value}</Typography.Text>
      </Typography.Text>
      <Typography.Text type="secondary">
        {t('common.pulseDuration')}: <Typography.Text >{machine.pulse_duration}</Typography.Text>
      </Typography.Text>
      <Typography.Text type="secondary">
        {t('common.pulseInterval')}: <Typography.Text >{machine.pulse_interval}</Typography.Text>
      </Typography.Text>
    </Box>
  );
};
