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
    }
  }, [updateControllerData]);

  useEffect(() => {
    if (controllerId) {
      getController(controllerId);
    }
  }, [controllerId]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>Controller Edit</Typography.Title>

        {controllerLoading && <Skeleton active />}

        <LeftRightSection
          left={(
            <Button
              type="default"
              size="large"
              onClick={() => navigate(`/controllers/${controllerId}/detail`)}>
              {t('common.back')}
            </Button>
          )}
          right={null}
        />

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
