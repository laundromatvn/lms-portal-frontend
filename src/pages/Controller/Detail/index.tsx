import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Flex, Skeleton, notification, Popconfirm } from 'antd';

import { TrashBinTrash } from '@solar-icons/react';

import { useGetControllerApi, type GetControllerResponse } from '@shared/hooks/useGetControllerApi';
import { useDeleteControllerApi } from '@shared/hooks/useDeleteControllerApi';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import { type Controller } from '@shared/types/Controller';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { DetailSection } from './DetailSection';
import { MachineSection } from './MachineSection';

export const ControllerDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

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
    <PortalLayoutV2
      title={`${controllerData?.name} (${controllerData?.device_id})`}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Flex justify="end" gap={theme.custom.spacing.small}>
          {can('controller.delete') && (
            <Popconfirm
              title={t('controller.deleteControllerConfirm')}
              onConfirm={() => deleteController(controllerId as string)}
              okText={t('common.delete')}
              cancelText={t('common.cancel')}
            >
              <Button
                loading={deleteControllerLoading}
                icon={<TrashBinTrash />}
                style={{
                  color: theme.custom.colors.danger.default,
                  backgroundColor: theme.custom.colors.danger.light,
                  border: 'none',
                }}
              >
                {t('common.delete')}
              </Button>
            </Popconfirm>
          )}
        </Flex>

        {controllerLoading && <Skeleton active />}

        {!controllerLoading && controllerData && (
          <>
            <DetailSection controller={controllerData as Controller} />
            {can('machine.list') && <MachineSection controller={controllerData as Controller} />}
          </>
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
