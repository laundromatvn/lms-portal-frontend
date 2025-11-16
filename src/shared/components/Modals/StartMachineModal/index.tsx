import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Button, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Machine } from '@shared/types/machine';

import {
  useStartMachineApi,
  type StartMachineResponse,
} from '@shared/hooks/useStartMachineApi';

import { BaseModal } from '@shared/components/BaseModal';

import { StartMachineModalBasicInformationSection } from './BasicInformationSection';
import { StartMachineModalStartMachineSection } from './StartMachineSection';

interface Props {
  machine: Machine;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onStartSuccess: () => void;
}

export const StartMachineModal: React.FC<Props> = ({
  machine,
  isModalOpen,
  setIsModalOpen,
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

    setIsModalOpen(false);

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
    <BaseModal
      maskClosable={true}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    >
      {contextHolder}

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', height: '100%' }}
      >
        <StartMachineModalBasicInformationSection machine={machine} />
        <StartMachineModalStartMachineSection machine={machine} onAmountChange={(value) => setAmount(value)} />

        <Flex justify="flex-end" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Button
            type="default"
            onClick={() => setIsModalOpen(false)}
          >
            {t('common.cancel')}
          </Button>

          <Button
            type="primary"
            onClick={() => startMachine(machine.id, amount)}
            loading={startMachineLoading}
            disabled={amount <= 0}
          >
            {t('common.startMachine')}
          </Button>
        </Flex>
      </Flex>
    </BaseModal>
  );
};
