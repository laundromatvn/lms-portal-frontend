import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Flex, Typography, Skeleton, notification } from 'antd';

import { ArrowLeft, CheckCircle, PlayCircle } from '@solar-icons/react';

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

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';

import { DetailSection } from './DetailSection';
import { MachineConfigSection } from './ConfigSection';

const DEFAULT_TOTAL_AMOUNT = 200000;

export const MachineDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const machineId = useParams().id;

  const {
    getMachine,
    data: machineData,
    loading: machineLoading,
    error: machineError,
  } = useGetMachineApi<GetMachineResponse>();
  const {
    startMachine,
    data: startMachineData,
    loading: startMachineLoading,
    error: startMachineError,
  } = useStartMachineApi<StartMachineResponse>();
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
    if (startMachineError) {
      api.error({
        message: t('messages.startMachineError'),
      });
    }
  }, [startMachineError]);

  useEffect(() => {
    if (startMachineData) {
      api.success({
        message: t('messages.startMachineSuccess'),
      });

      getMachine(machineId as string);
    }
  }, [startMachineData]);

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
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('common.machineDetail')}</Typography.Title>

        <LeftRightSection
          left={(
            <Button
              type="link"
              icon={<ArrowLeft color={theme.custom.colors.text.primary} />}
              onClick={() => navigate(-1)}
            >
              {t('common.back')}
            </Button>
          )}
          right={(<Flex gap={theme.custom.spacing.medium}>
            <Button
              type="default"
              icon={<PlayCircle weight="Outline" />}
              onClick={() => startMachine(machineId as string, DEFAULT_TOTAL_AMOUNT)}
              loading={startMachineLoading}
              style={{
                color: theme.custom.colors.success.default,
                borderColor: theme.custom.colors.success.default,
                backgroundColor: theme.custom.colors.background.light,
              }}
            >
              {t('common.startMachine')}
            </Button>
            <Button 
              type="default"
              onClick={() => activateMachine(machineId as string)}
              icon={<CheckCircle weight="Outline" />}
              loading={activateMachineLoading}
              style={{
                color: theme.custom.colors.success.default,
                borderColor: theme.custom.colors.success.default,
                backgroundColor: theme.custom.colors.background.light,
              }}
            >
              {t('common.activateMachine')}
            </Button>
          </Flex>)}
        />

      {machineLoading && <Skeleton active />}

      {!machineLoading && machineData && (
        <>
          <DetailSection machine={machineData as Machine} />
          <MachineConfigSection machine={machineData as Machine} />
        </>
      )}
    </Flex>
    </PortalLayout >
  );
};
