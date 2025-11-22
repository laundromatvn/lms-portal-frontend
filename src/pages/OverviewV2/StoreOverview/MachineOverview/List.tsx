import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@shared/theme/useTheme';

import type { Machine } from '@shared/types/machine';

import { Box } from '@shared/components/Box';

import { MachineOverviewItem } from './Item';

interface Props {
  machines: Machine[];
  loading: boolean;
  onStartSuccess: () => void;
  onSaveMachine?: () => void;
}

export const MachineOverviewList: React.FC<Props> = ({ machines, loading, onStartSuccess, onSaveMachine }) => {
  const theme = useTheme();

  return (
    <Box
      vertical
      gap={theme.custom.spacing.medium}
      loading={loading}
      style={{ width: '100%' }}
    >
      {machines.map((machine) => (
        <MachineOverviewItem
          machine={machine}
          onStartSuccess={onStartSuccess}
          onSaveMachine={onSaveMachine}
        />
      ))}
    </Box>
  );
};
