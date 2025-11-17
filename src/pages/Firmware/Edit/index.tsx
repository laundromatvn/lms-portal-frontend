import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  notification,
  Skeleton,
  type FormInstance,
} from 'antd';

import type { Firmware } from '@shared/types/Firmware';

import {
  useGetFirmwareApi,
  type GetFirmwareResponse,
} from '@shared/hooks/firmware/useGetFirmwareApi';
import {
  useUpdateFirmwareApi,
  type UpdateFirmwareResponse,
} from '@shared/hooks/firmware/useUpdateFirmwareApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';

import { EditFirmwareBasicInformationSection } from './BasicInformationSection';

export const FirmwareEditPage: React.FC = () => {
  const { t } = useTranslation();
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
    updateFirmware,
    data: updateFirmwareData,
    error: updateFirmwareError,
    loading: updateFirmwareLoading,
  } = useUpdateFirmwareApi<UpdateFirmwareResponse>();

  const handleSave = async (form: FormInstance) => {
    try {
      const values = await form.validateFields();
      updateFirmware(firmwareId as string, values);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  }

  useEffect(() => {
    if (firmwareError) {
      api.error({
        message: t('firmware.getFirmwareError'),
      });
    }
  }, [firmwareError]);

  useEffect(() => {
    if (updateFirmwareError) {
      api.error({
        message: t('firmware.updateFirmwareError'),
      });
    }
  }, [updateFirmwareError]);

  useEffect(() => {
    if (updateFirmwareData) {
      api.success({
        message: t('firmware.updateFirmwareSuccess'),
      });

      navigate(`/firmware/${firmwareId}/detail`);
    }
  }, [updateFirmwareData]);

  useEffect(() => {
    if (firmwareId) {
      getFirmware(firmwareId);
    }
  }, [firmwareId]);

    return (
    <PortalLayout title={firmwareData?.name || firmwareId} onBack={() => navigate(-1)}>
      {contextHolder}

      {firmwareLoading && <Skeleton active />}

      <EditFirmwareBasicInformationSection
        firmware={firmwareData as Firmware | null}
        onSave={handleSave}
      />
    </PortalLayout>
  );
};
