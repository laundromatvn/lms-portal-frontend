import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Flex,
  Skeleton,
  notification,
  type FormInstance,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Controller } from '@shared/types/Controller';

import {
  useGetControllerApi,
  type GetControllerResponse,
} from '@shared/hooks/useGetControllerApi';
import {
  useUpdateControllerApi,
  type UpdateControllerResponse,
} from '@shared/hooks/useUpdateControllerApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { EditSection } from './EditSection';

export const ControllerEditPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const controllerId = useParams().id as string;

  const {
    getController,
    data: controllerData,
    loading: controllerLoading,
    error: controllerError,
  } = useGetControllerApi<GetControllerResponse>();
  const {
    updateController,
    data: updateControllerData,
    error: updateControllerError,
  } = useUpdateControllerApi<UpdateControllerResponse>();

  const onSave = (form: FormInstance) => {
    updateController(
      controllerId,
      {
        device_id: form.getFieldValue('device_id'),
        name: form.getFieldValue('name'),
        total_relays: form.getFieldValue('total_relays'),
        status: form.getFieldValue('status'),
      }
    );
  }

  useEffect(() => {
    if (controllerError) {
      api.error({
        message: t('controller.getControllerError'),
      });
    }
  }, [controllerError]);

  useEffect(() => {
    if (updateControllerError) {
      api.error({
        message: t('controller.updateControllerError'),
      });
    }
  }, [updateControllerError]);

  useEffect(() => {
    if (updateControllerData) {
      api.success({
        message: t('controller.updateControllerSuccess'),
      });

      navigate(`/controllers/${controllerId}/detail`);
    }
  }, [updateControllerData]);

  useEffect(() => {
    if (controllerId) {
      getController(controllerId);
    }
  }, [controllerId]);

  return (
    <PortalLayoutV2 title={controllerData?.name || controllerId} onBack={() => navigate(-1)}>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        {controllerLoading && <Skeleton active />}

        {!controllerLoading && controllerData && (
          <EditSection
            controller={controllerData as Controller}
            onSave={onSave}
          />
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
