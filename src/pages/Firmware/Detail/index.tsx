import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, notification, Skeleton, Typography } from 'antd';

import { ArrowLeft } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { Firmware } from '@shared/types/Firmware';

import {
  useGetFirmwareApi,
  type GetFirmwareResponse,
} from '@shared/hooks/firmware/useGetFirmwareApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import { LeftRightSection } from '@shared/components/LeftRightSection';

import { BasicInformationSection } from './BasicInformationSection';

export const FirmwareDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const firmwareId = useParams().id;

  const {
    getFirmware,
    data: firmwareData,
    loading: firmwareLoading,
    error: firmwareError,
  } = useGetFirmwareApi<GetFirmwareResponse>();

  useEffect(() => {
    if (firmwareError) {
      api.error({
        message: t('firmware.getFirmwareError'),
      });
    }
  }, [firmwareError]);

  useEffect(() => {
    if (firmwareId) {
      getFirmware(firmwareId);
    }
  }, [firmwareId]);

  return (
    <PortalLayout>
      {contextHolder}

      <Typography.Title level={2}>{t('common.firmwareDetail')}</Typography.Title>

      <LeftRightSection
        left={
          <Button
            type="link"
            icon={<ArrowLeft color={theme.custom.colors.text.primary} />}
            onClick={() => navigate(-1)}
          >
            {t('common.back')}
          </Button>
        }
        right={null}
      />

      {firmwareLoading && <Skeleton active />}

      <BasicInformationSection firmware={firmwareData as Firmware | null} />
    </PortalLayout>
  );
};
