import React from 'react';

import { WashingMachineMinimalistic } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { MachineTypeEnum } from '@shared/enums/MachineTypeEnum';

import { Box } from '@shared/components/Box';

interface Props {
  machineType: MachineTypeEnum;
  size?: number;
  style?: React.CSSProperties;
}

export const MachineIcon: React.FC<Props> = ({ machineType, size = 48, style }) => {
  const theme = useTheme();

  return <Box 
    border
    style={{
      padding: theme.custom.spacing.small,
      backgroundColor: machineType === MachineTypeEnum.WASHER 
        ? theme.custom.colors.info.light 
        : theme.custom.colors.warning.light,
      borderColor: machineType === MachineTypeEnum.WASHER 
        ? theme.custom.colors.info.default 
        : theme.custom.colors.warning.default,
      ...style,
    }}
  >
    <WashingMachineMinimalistic
      weight="BoldDuotone"
      size={size}
      color={machineType === MachineTypeEnum.WASHER 
        ? theme.custom.colors.info.default
        : theme.custom.colors.warning.default}
    />
  </Box>;
};
