import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Drawer, Flex, Button, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Machine } from '@shared/types/machine';

import {
  useStartMachineApi,
  type StartMachineResponse,
} from '@shared/hooks/useStartMachineApi';

import { StartMachineDrawerBasicInformationSection } from './BasicInformationSection';
import { StartMachineDrawerStartMachineSection } from './StartMachineSection';

interface Props {
  machine: Machine;
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onStartSuccess: () => void;
}

export const StartMachineDrawer: React.FC<Props> = ({
  machine,
  isDrawerOpen,
  setIsDrawerOpen,
  onStartSuccess,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [api, contextHolder] = notification.useNotification();

  const [amount, setAmount] = useState<number>(0);

  const {
    startMachine,
    data: startMachineData,
    loading: startMachineLoading,
    error: startMachineError,
  } = useStartMachineApi<StartMachineResponse>();

  useEffect(() => {
    if (!startMachineData) return;

    setIsDrawerOpen(false);

    api.success({
      message: t('messages.startMachineSuccess'),
    });

    onStartSuccess?.();
  }, [startMachineData]);

  useEffect(() => {
    if (!startMachineError) return;

    api.error({
      message: t('messages.startMachineError'),
    });
  }, [startMachineError]);

  return (
    <Drawer
      title={t('common.startMachine')}
      placement="right"
      onClose={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      width={480}
      styles={{
        body: {
          padding: theme.custom.spacing.medium,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {contextHolder}

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', height: '100%' }}
      >
        <StartMachineDrawerBasicInformationSection machine={machine} />
        <StartMachineDrawerStartMachineSection
          machine={machine}
          onAmountChange={(value) => setAmount(value)}
        />

        <Flex justify="flex-end" gap={theme.custom.spacing.medium} style={{ width: '100%', marginTop: 'auto' }}>
          <Button
            type="default"
            size="large"
            onClick={() => setIsDrawerOpen(false)}
            style={{ width: '100%' }}
          >
            {t('common.cancel')}
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={() => startMachine(machine.id, amount)}
            loading={startMachineLoading}
            disabled={amount <= 0}
            style={{ width: '100%' }}
          >
            {t('common.startMachine')}
          </Button>
        </Flex>
      </Flex>
    </Drawer>
  );
};
