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

import { ArrowLeft } from '@solar-icons/react';

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

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
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
    loading: updateControllerLoading,
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
    <PortalLayout title={controllerData?.name || controllerId} onBack={() => navigate(-1)}>
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
    </PortalLayout>
  );
};
