import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  Form,
  Button,
  notification,
} from 'antd';

import { AddCircle, ArrowLeft } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useAddFirmwareApi,
  type AddFirmwareRequest,
  type AddFirmwareResponse,
} from '@shared/hooks/firmware/useAddFirmwareApi';

import { FirmwareStatusEnum } from '@shared/enums/FirmwareStatusEnum';
import { FirmwareVersionTypeEnum } from '@shared/enums/FirmwareVersionTypeEnum';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';

import { AddFirmwareBasicInformationSection } from './BasicInformationSection';
import { UploadFirmwareSection } from './UploadFirmwareSection';


export const FirmwareAddPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm<AddFirmwareRequest>();
  const [formValues, setFormValues] = useState<any>({});

  const {
    addFirmware,
    loading: addFirmwareLoading,
    data: addFirmwareData,
    error: addFirmwareError,
  } = useAddFirmwareApi<AddFirmwareResponse>();

  const handleSave = async () => {
    try {
      form.setFieldsValue(formValues);
      const values = await form.validateFields();
      console.log("values", values);
      addFirmware(values);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  useEffect(() => {
    if (addFirmwareError) {
      api.error({
        message: t('messages.addFirmwareError'),
      });
    }
  }, [addFirmwareError]);

  useEffect(() => {
    if (addFirmwareData) {
      api.success({
        message: t('messages.addFirmwareSuccess'),
      });

      navigate('/firmware');
    }
  }, [addFirmwareData]);

  return (
    <PortalLayout>
      {contextHolder}

      <Typography.Title level={2}>{t('common.firmware')}</Typography.Title>

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
          <Button
            type="primary"
            icon={<AddCircle color={theme.custom.colors.text.inverted} />}
            onClick={handleSave}
            loading={addFirmwareLoading}
          >
            {t('common.add')}
          </Button>
        )}
      />

      <AddFirmwareBasicInformationSection 
        form={form}
        onChange={(values) => {
          setFormValues({ ...formValues, ...values });
        }} 
      />

      <UploadFirmwareSection
        form={form}
        onChange={(values) => {
          console.log("upload firmware values", values);
          setFormValues({ ...formValues, ...values });
        }}
      />
    </PortalLayout >
  );
};
