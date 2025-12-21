import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Flex,
  Segmented,
  notification,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import type { Firmware } from '@shared/types/Firmware';

import {
  useGetFirmwareApi,
  type GetFirmwareResponse,
} from '@shared/hooks/firmware/useGetFirmwareApi';
import {
  useReleaseFirmwareApi,
} from '@shared/hooks/firmware/useReleaseFirmwareApi';
import {
  useDeprecateFirmwareApi,
} from '@shared/hooks/firmware/useDeprecateFirmwareApi';
import {
  useDeleteFirmwareApi,
} from '@shared/hooks/firmware/useDeleteFirmwareApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { BasicInformationSection } from './BasicInformationSection';
import { ControllersSection } from './ControllersSection';

export const FirmwareDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [api, contextHolder] = notification.useNotification();

  const firmwareId = useParams().id;

  const segmentedOptions = [
    {
      label: t('firmware.information'),
      value: 'basicInformation',
    },
    {
      label: t('firmware.controllers'),
      value: 'controllerList',
    },
  ];

  const [selectedTab, setSelectedTab] = useState<string>(segmentedOptions[0].value);

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
    <PortalLayoutV2
      title={firmwareData?.name}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <Flex 
        justify={isMobile ? 'flex-end' : 'flex-start'}
        align="center"
        style={{ width: '100%' }}
      >
        <Segmented
          size="large"
          options={segmentedOptions}
          value={selectedTab}
          onChange={(value) => setSelectedTab(value)}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            padding: theme.custom.spacing.xxsmall,
          }}
        />
      </Flex>

      <Flex
        vertical
        gap={theme.custom.spacing.small}
        style={{
          width: '100%',
          height: '100%',
          marginTop: theme.custom.spacing.medium,
        }}
      >
        {selectedTab === 'basicInformation' && (
          <BasicInformationSection
            firmware={firmwareData as Firmware | null}
            releaseFirmware={releaseFirmware}
            deprecateFirmware={deprecateFirmware}
            deleteFirmware={deleteFirmware}
            firmwareLoading={firmwareLoading}
          />
        )}

        {selectedTab === 'controllerList' && (
          <ControllersSection firmware={firmwareData as Firmware | null} />
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
