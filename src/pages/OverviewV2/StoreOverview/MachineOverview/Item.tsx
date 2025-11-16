import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography } from 'antd';

import {
  Play,
  Settings
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { Machine } from '@shared/types/machine';

import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';
import { StartMachineModal } from '@shared/components/Modals/StartMachineModal';

import formatCurrencyCompact from '@shared/utils/currency';

interface Props {
  machine: Machine;
}

export const MachineOverviewItem: React.FC<Props> = ({ machine }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [isStartMachineModalOpen, setIsStartMachineModalOpen] = useState(false);

  return (
    <>
      <Box
        vertical
        border
        justify="space-between"
        align="center"
        gap={theme.custom.spacing.small}
        style={{
          width: '100%',
          padding: theme.custom.spacing.medium,
        }}
      >
        <Flex justify="space-between" align="center" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
          <Typography.Link strong onClick={() => navigate(`/machines/${machine.id}/detail`)}>
            {machine.name || "No name"} - ({`${t('common.machine')} ${machine.relay_no}`})
          </Typography.Link>
          <DynamicTag value={machine.status} />
        </Flex>

        <Flex gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
          <Typography.Text type="secondary">
            {machine.machine_type}
          </Typography.Text>
        </Flex>

        <Flex justify="space-between" align="center" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
          <Typography.Text strong style={{ color: theme.custom.colors.success.default }}>
            {formatCurrencyCompact(machine.base_price)}
          </Typography.Text>

          <Flex gap={theme.custom.spacing.small}>
            <Button
              type="default"
              icon={<Play />}
              onClick={() => setIsStartMachineModalOpen(true)}
            />

            <Button
              type="default"
              icon={<Settings />}
              onClick={() => { }}
            />
          </Flex>
        </Flex>
      </Box>

      <StartMachineModal
        machine={machine}
        isModalOpen={isStartMachineModalOpen}
        setIsModalOpen={setIsStartMachineModalOpen}
      />
    </>
  );
};
