import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Form,
  notification,
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import {
  useAddFirmwareApi,
  type AddFirmwareRequest,
  type AddFirmwareResponse,
} from '@shared/hooks/firmware/useAddFirmwareApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { AddFirmwareBasicInformationSection } from './BasicInformationSection';
import { UploadFirmwareSection } from './UploadFirmwareSection';


export const FirmwareAddPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
    <PortalLayoutV2
      title={t('navigation.firmware')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <Flex
        justify="end"
        align="center"
        gap={theme.custom.spacing.medium}
        style={{ width: '100%' }}
      >
        <Button
          icon={<PlusOutlined />}
          onClick={handleSave}
          loading={addFirmwareLoading}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        >
          {t('common.add')}
        </Button>
      </Flex>

      <Flex
        vertical={true}
        gap={theme.custom.spacing.medium}
        style={{
          width: '100%',
          height: '100%',
          marginTop: theme.custom.spacing.medium,
        }}
      >
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
      </Flex>
    </PortalLayoutV2 >
  );
};
