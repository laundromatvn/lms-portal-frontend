import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Flex, Typography, Skeleton, notification } from 'antd';

import {
  useGetMachineApi,
  type GetMachineResponse,
} from '@shared/hooks/useGetMachineApi';

import { useTheme } from '@shared/theme/useTheme';

import { type Machine } from '@shared/types/machine';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DetailSection } from './DetailSection';

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

  useEffect(() => {
    if (machineError) {
      api.error({
        message: t('machine.getMachineError'),
      });
    }
  }, [machineError]);

  useEffect(() => {
    if (machineId) {
      getMachine(machineId);
    }
  }, [machineId]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>Machine Detail</Typography.Title>

        <LeftRightSection
          left={null}
          right={(<>
            <Button type="default" size="large" onClick={() => navigate(`/machines/${machineId}/edit`)}>
              {t('common.edit')}
            </Button>
          </>)}
        />

        {machineLoading && <Skeleton active />}

        {!machineLoading && machineData && (
          <>
            <DetailSection machine={machineData as Machine} />
          </>
        )}
      </Flex>
    </PortalLayout>
  );
};
