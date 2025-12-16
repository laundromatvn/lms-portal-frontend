import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, notification, Typography } from 'antd';

import {
  Play,
  Settings,
  Refresh
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useActivateMachineApi,
  type ActivateMachineResponse,
} from '@shared/hooks/useActivateMachineApi';

import type { Machine } from '@shared/types/machine';

import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';
import { StartMachineDrawer } from '@shared/components/Drawer/StartMachineDrawer';
import { MachineSettingDrawer } from '@shared/components/Drawer/MachineSettingDrawer';

import formatCurrencyCompact from '@shared/utils/currency';

interface Props {
  machine: Machine;
  onStartSuccess: () => void;
  onSaveMachine?: () => void;
}

export const MachineOverviewItem: React.FC<Props> = ({ machine, onStartSuccess, onSaveMachine }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [isStartMachineDrawerOpen, setIsStartMachineDrawerOpen] = useState(false);
  const [isMachineSettingDrawerOpen, setIsMachineSettingDrawerOpen] = useState(false);

  const {
    activateMachine,
    data: activateMachineData,
    loading: activateMachineLoading,
    error: activateMachineError,
  } = useActivateMachineApi<ActivateMachineResponse>();

  useEffect(() => {
    if (activateMachineData) {
      onStartSuccess();
    }
  }, [activateMachineData]);

  useEffect(() => {
    if (activateMachineError) {
      api.error({
        message: t('messages.activateMachineError'),
      });
    }
  }, [activateMachineError]);

  return (
    <>
      {contextHolder}

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
              onClick={() => setIsStartMachineDrawerOpen(true)}
            />

            <Button
              type="default"
              icon={<Refresh />}
              onClick={() => activateMachine(machine.id)}
              loading={activateMachineLoading}
            />

            {onSaveMachine && (
              <Button
                type="default"
                icon={<Settings />}
                onClick={() => setIsMachineSettingDrawerOpen(true)}
              />
            )}
          </Flex>
        </Flex>
      </Box>

      <StartMachineDrawer
        machine={machine}
        isDrawerOpen={isStartMachineDrawerOpen}
        setIsDrawerOpen={setIsStartMachineDrawerOpen}
        onStartSuccess={onStartSuccess}
      />

      {onSaveMachine && (
        <MachineSettingDrawer
          machine={machine}
          isDrawerOpen={isMachineSettingDrawerOpen}
          setIsDrawerOpen={setIsMachineSettingDrawerOpen}
          onSave={onSaveMachine}
        />
      )}
    </>
  );
};
