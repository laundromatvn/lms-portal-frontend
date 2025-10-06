import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Flex, Typography, Skeleton, notification } from 'antd';

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
        <Typography.Title level={2}>Machine Detail</Typography.Title>

        <LeftRightSection
          left={null}
          right={(<Flex gap={theme.custom.spacing.medium}>
            <Button type="primary" size="large" onClick={() => {
              startMachine(machineId as string, DEFAULT_TOTAL_AMOUNT);
            }}>
              {t('common.startMachine')}
            </Button>
            <Button 
              type="primary"
              size="large"
              onClick={() => activateMachine(machineId as string)}
              loading={activateMachineLoading}
              style={{
                color: theme.custom.colors.success.light,
                backgroundColor: theme.custom.colors.success.default,
                borderColor: theme.custom.colors.success.default,
              }}
            >
              {t('common.activateMachine')}
            </Button>
            <Button type="default" size="large" onClick={() => navigate(`/machines/${machineId}/edit`)}>
              {t('common.edit')}
            </Button>
          </Flex>)}
        />

      {machineLoading && <Skeleton active />}

      {!machineLoading && machineData && (
        <>
          <DetailSection machine={machineData as Machine} />
        </>
      )}
    </Flex>
    </PortalLayout >
  );
};
