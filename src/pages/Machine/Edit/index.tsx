import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Button,
  Flex,
  Typography,
  Skeleton,
  notification,
  type FormInstance,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Machine } from '@shared/types/machine';

import {
  useGetMachineApi,
  type GetMachineResponse,
} from '@shared/hooks/useGetMachineApi';
import {
  useUpdateMachineApi,
  type UpdateMachineResponse,
} from '@shared/hooks/useUpdateMachineApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { EditSection } from './EditSection';

export const MachineEditPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const machineId = useParams().id as string;

  const {
    getMachine,
    data: machineData,
    loading: machineLoading,
    error: machineError,
  } = useGetMachineApi<GetMachineResponse>();
  const {
    updateMachine,
    data: updateMachineData,
    loading: updateMachineLoading,
    error: updateMachineError,
  } = useUpdateMachineApi<UpdateMachineResponse>();

  const onSave = (form: FormInstance) => {
    updateMachine(
      machineId,
      {
        name: form.getFieldValue('name'),
        machine_type: form.getFieldValue('machine_type'),
        base_price: form.getFieldValue('base_price'),
        status: form.getFieldValue('status'),
        pulse_duration: form.getFieldValue('pulse_duration'),
        pulse_value: form.getFieldValue('pulse_value'),
      }
    );
  }

  useEffect(() => {
    if (machineError) {
      api.error({
        message: t('messages.getMachineError'),
      });
    }
  }, [machineError]);

  useEffect(() => {
    if (updateMachineError) {
      api.error({
        message: t('messages.updateMachineError'),
      });
    }
  }, [updateMachineError]);

  useEffect(() => {
    if (updateMachineData) {
      api.success({
        message: t('messages.updateMachineSuccess'),
      });

      navigate(`/machines/${machineId}/detail`);
    }
  }, [updateMachineData]);

  useEffect(() => {
    if (machineId) {
      getMachine(machineId);
    }
  }, [machineId]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>Store Edit</Typography.Title>

        <LeftRightSection
          left={(
            <Button
              type="default"
              size="large"
              onClick={() => navigate(`/machines/${machineId}/detail`)}>
              {t('common.back')}
            </Button>
          )}
          right={null}
        />

        {machineLoading && <Skeleton active />}

        {!machineLoading && machineData && (
          <>
            <EditSection
              machine={machineData as Machine}
              onSave={onSave}
            />
          </>
        )}
      </Flex>
    </PortalLayout>
  );
};
