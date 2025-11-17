import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Flex, Typography, Skeleton, notification, Popconfirm } from 'antd';

import { ArrowLeft, TrashBinTrash } from '@solar-icons/react';

import { useGetControllerApi, type GetControllerResponse } from '@shared/hooks/useGetControllerApi';
import { useDeleteControllerApi } from '@shared/hooks/useDeleteControllerApi';

import { useTheme } from '@shared/theme/useTheme';

import { type Controller } from '@shared/types/Controller';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DetailSection } from './DetailSection';
import { MachineListSection } from './MachineListSection';

export const ControllerDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const controllerId = useParams().id;

  const {
    getController,
    data: controllerData,
    loading: controllerLoading,
    error: controllerError,
  } = useGetControllerApi<GetControllerResponse>();
  const {
    deleteController,
    data: deleteControllerData,
    error: deleteControllerError,
    loading: deleteControllerLoading,
  } = useDeleteControllerApi<void>();

  useEffect(() => {
    if (controllerError) {
      api.error({
        message: t('controller.getControllerError'),
      });
    }
  }, [controllerError]);

  useEffect(() => {
    if (controllerId) {
      getController(controllerId);
    }
  }, [controllerId]);

  return (
    <PortalLayout title={t('common.controllerDetail')} onBack={() => navigate(-1)}>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        {controllerLoading && <Skeleton active />}

        <LeftRightSection
          left={null}
          right={(
            <Popconfirm
              title={t('controller.deleteControllerConfirm')}
              onConfirm={() => deleteController(controllerId as string)}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
            >
              <Button
                danger
                type="default"
                loading={deleteControllerLoading}
                style={{
                  backgroundColor: theme.custom.colors.background.light,
                }}
              >
                <TrashBinTrash weight="Outline" color={theme.custom.colors.danger.default} />
                {t('common.delete')}
              </Button>
            </Popconfirm>
          )}
        />

        {!controllerLoading && controllerData && (
          <>
            <DetailSection controller={controllerData as Controller} />
            <MachineListSection controller={controllerData as Controller} />
          </>
        )}
      </Flex>
    </PortalLayout>
  );
};
