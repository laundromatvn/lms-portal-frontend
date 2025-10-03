import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Flex, Typography, Skeleton, notification } from 'antd';

import { useGetControllerApi, type GetControllerResponse } from '@shared/hooks/useGetControllerApi';

import { useTheme } from '@shared/theme/useTheme';

import { type Controller } from '@shared/types/Controller';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DetailSection } from './DetailSection';

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
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>Controller Detail</Typography.Title>

        {controllerLoading && <Skeleton active />}

        <LeftRightSection
          left={null}
          right={(<>
            <Button type="default" size="large" onClick={() => navigate(`/controllers/${controllerId}/edit`)}>
              {t('common.edit')}
            </Button>
          </>)}
        />

        {!controllerLoading && controllerData && (
          <DetailSection controller={controllerData as Controller} />
        )}
      </Flex>
    </PortalLayout>
  );
};
