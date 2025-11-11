import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Dropdown, Flex, notification, Skeleton, Typography } from 'antd';

import {
  ArrowLeft,
  MenuDots,
  Rocket2,
  ArchiveDown,
  TrashBinTrash,
  Refresh,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { Firmware } from '@shared/types/Firmware';

import {
  useGetFirmwareApi,
  type GetFirmwareResponse,
} from '@shared/hooks/firmware/useGetFirmwareApi';
import {
  useReleaseFirmwareApi,
  type ReleaseFirmwareResponse,
} from '@shared/hooks/firmware/useReleaseFirmwareApi';
import {
  useDeprecateFirmwareApi,
  type DeprecateFirmwareResponse,
} from '@shared/hooks/firmware/useDeprecateFirmwareApi';
import {
  useDeleteFirmwareApi,
  type DeleteFirmwareResponse,
} from '@shared/hooks/firmware/useDeleteFirmwareApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import { LeftRightSection } from '@shared/components/LeftRightSection';

import { BasicInformationSection } from './BasicInformationSection';
import { ControllerListSection } from './ControllerListSection';

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

  const {
    releaseFirmware,
    data: releaseFirmwareData,
    error: releaseFirmwareError,
  } = useReleaseFirmwareApi();

  const {
    deprecateFirmware,
    data: deprecateFirmwareData,
    error: deprecateFirmwareError,
  } = useDeprecateFirmwareApi();

  const {
    deleteFirmware,
    data: deleteFirmwareData,
    error: deleteFirmwareError,
  } = useDeleteFirmwareApi();

  const handleGetFirmware = () => {
    if (firmwareId) {
      getFirmware(firmwareId as string);
    }
  };

  useEffect(() => {
    if (firmwareError) {
      api.error({
        message: t('firmware.getFirmwareError'),
      });
    }
  }, [firmwareError]);

  useEffect(() => {
    if (releaseFirmwareError) {
      api.error({
        message: t('messages.releaseFirmwareError'),
      });
    }
  }, [releaseFirmwareError]);

  useEffect(() => {
    if (deprecateFirmwareError) {
      api.error({
        message: t('messages.deprecateFirmwareError'),
      });
    }
  }, [deprecateFirmwareError]);

  useEffect(() => {
    if (deleteFirmwareError) {
      api.error({
        message: t('messages.deleteFirmwareError'),
      });
    }
  }, [deleteFirmwareError]);

  useEffect(() => {
    if (firmwareId) {
      handleGetFirmware();
    }
  }, [firmwareId]);

  useEffect(() => {
    if (releaseFirmwareData) {
      api.success({
        message: t('messages.releaseFirmwareSuccess'),
      });

      handleGetFirmware();
    }
  }, [releaseFirmwareData]);

  useEffect(() => {
    if (deprecateFirmwareData) {
      api.success({
        message: t('messages.deprecateFirmwareSuccess'),
      });

      handleGetFirmware();
    }
  }, [deprecateFirmwareData]);

  useEffect(() => {
    if (deleteFirmwareData) {
      api.success({
        message: t('messages.deleteFirmwareSuccess'),
      });
      
      navigate('/firmware');
    }
  }, [deleteFirmwareData]);

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
        right={(
          <Flex gap={theme.custom.spacing.medium}>
            <Button
              type="default"
              icon={<Refresh size={18} />}
              onClick={handleGetFirmware}
              loading={firmwareLoading}
            />

            <Dropdown
              menu={{
                items: [
                  {
                    key: 'release',
                    label: t('common.release'),
                    onClick: () => releaseFirmware(firmwareId as string),
                    icon: <Rocket2 weight="Outline" color={theme.custom.colors.success.default} />,
                    style: {
                      color: theme.custom.colors.success.default,
                    },
                  },
                  {
                    key: 'deprecate',
                    label: t('common.deprecate'),
                    onClick: () => deprecateFirmware(firmwareId as string),
                    icon: <ArchiveDown weight="Outline" color={theme.custom.colors.warning.default} />,
                    style: {
                      color: theme.custom.colors.warning.default,
                    },
                  },
                  {
                    key: 'delete',
                    label: t('common.delete'),
                    onClick: () => deleteFirmware(firmwareId as string),
                    icon: <TrashBinTrash weight="Outline" color={theme.custom.colors.danger.default} />,
                    style: {
                      color: theme.custom.colors.danger.default,
                    },
                  },
                ],
              }}
            >
              <Button
                type="default"
                icon={<MenuDots weight="Bold" />}
                loading={firmwareLoading}
              >
                {t('common.actions')}
              </Button>
            </Dropdown>
          </Flex>
        )}
      />

      {firmwareLoading && <Skeleton active />}

      <BasicInformationSection firmware={firmwareData as Firmware | null} />

      <ControllerListSection firmware={firmwareData as Firmware | null} />
    </PortalLayout>
  );
};
