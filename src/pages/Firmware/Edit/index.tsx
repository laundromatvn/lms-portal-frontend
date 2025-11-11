import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  notification,
  Button,
  Skeleton,
  Typography,
  Form,
  type FormInstance,
} from 'antd';

import { ArrowLeft } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

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
import { LeftRightSection } from '@shared/components/LeftRightSection';

import { EditFirmwareBasicInformationSection } from './BasicInformationSection';

export const FirmwareEditPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

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
    <PortalLayout>
      {contextHolder}

      <Typography.Title level={2}>{t('common.firmwareEdit')}</Typography.Title>

      <LeftRightSection
        left={(
          <Button
            type="link"
            icon={<ArrowLeft color={theme.custom.colors.text.primary} />}
            onClick={() => navigate(-1)}
          >
            {t('common.back')}
          </Button>
        )}
        right={null}
      />

      {firmwareLoading && <Skeleton active />}

      <EditFirmwareBasicInformationSection
        firmware={firmwareData as Firmware | null}
        onSave={handleSave}
      />
    </PortalLayout>
  );
};
