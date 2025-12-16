import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Flex, Skeleton, notification } from 'antd';

import { CheckCircle, PlayCircle } from '@solar-icons/react';

import {
  useGetMachineApi,
  type GetMachineResponse,
} from '@shared/hooks/useGetMachineApi';
import {
  useStartMachineApi,
  type StartMachineResponse,
} from '@shared/hooks/useStartMachineApi';
import {
  useActivateMachineApi,
  type ActivateMachineResponse,
} from '@shared/hooks/useActivateMachineApi';

import { useTheme } from '@shared/theme/useTheme';

import { type Machine } from '@shared/types/machine';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { StartMachineDrawer } from '@shared/components/Drawer/StartMachineDrawer';

import { DetailSection } from './DetailSection';
import { MachineConfigSection } from './ConfigSection';

export const MachineDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const machineId = useParams().id;

  const [isStartMachineDrawerOpen, setIsStartMachineDrawerOpen] = useState(false);

  const {
    getMachine,
    data: machineData,
    loading: machineLoading,
    error: machineError,
  } = useGetMachineApi<GetMachineResponse>();
  const {
    activateMachine,
    data: activateMachineData,
    loading: activateMachineLoading,
    error: activateMachineError,
  } = useActivateMachineApi<ActivateMachineResponse>();

  useEffect(() => {
    if (machineError) {
      api.error({
        message: t('messages.getMachineError'),
      });
    }
  }, [machineError]);

  useEffect(() => {
    if (machineId) {
      getMachine(machineId);
    }
  }, [machineId]);

  useEffect(() => {
    if (activateMachineError) {
      api.error({
        message: t('messages.activateMachineError'),
      });
    }
  }, [activateMachineError]);

  useEffect(() => {
    if (activateMachineData) {
      api.success({
        message: t('messages.activateMachineSuccess'),
      });

      getMachine(machineId as string);
    }
  }, [activateMachineData, machineId]);

  return (
    <PortalLayoutV2
      title={`${t('common.machine')} ${machineData?.name || machineData?.relay_no}`}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Flex
          justify="flex-end"
          align="center"
          gap={theme.custom.spacing.small}
          style={{ width: '100%' }}
        >
          <Button
            type="default"
            onClick={() => activateMachine(machineId as string)}
            icon={<CheckCircle weight="Outline" />}
            loading={activateMachineLoading}
            style={{ backgroundColor: theme.custom.colors.background.light }}
          >
            {t('common.reset')}
          </Button>

          <Button
            type="default"
            icon={<PlayCircle weight="Outline" />}
            onClick={() => setIsStartMachineDrawerOpen(true)}
            style={{ backgroundColor: theme.custom.colors.background.light }}
          >
            {t('common.start')}
          </Button>
        </Flex>

        {machineLoading && <Skeleton active />}

        {!machineLoading && machineData && (
          <>
            <DetailSection machine={machineData as Machine} />
            <MachineConfigSection machine={machineData as Machine} />
          </>
        )}
      </Flex>

      <StartMachineDrawer
        machine={machineData as Machine}
        isDrawerOpen={isStartMachineDrawerOpen}
        setIsDrawerOpen={setIsStartMachineDrawerOpen}
        onStartSuccess={() => {
          getMachine(machineId as string);
          setIsStartMachineDrawerOpen(false);
        }}
      />
    </PortalLayoutV2 >
  );
};
