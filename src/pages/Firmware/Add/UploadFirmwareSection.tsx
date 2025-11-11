import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Flex,
  Upload,
  Spin,
  Typography,
  type FormInstance,
  Form,
  Input,
} from 'antd';
import type { RcFile } from 'antd/es/upload';

import { CloudUpload } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useUploadFirmwareApi,
  type UploadFirmwareResponse,
} from '@shared/hooks/firmware/useUploadFirmwareApi';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  form: FormInstance;
  onChange: (values: any) => void;
}

export const UploadFirmwareSection: React.FC<Props> = ({ form, onChange }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    uploadFirmware,
    loading: uploadFirmwareLoading,
    data: uploadFirmwareData,
    error: uploadFirmwareError,
  } = useUploadFirmwareApi<UploadFirmwareResponse>();

  const handleUpload = (options: any) => {
    const file = options.file as RcFile;
    uploadFirmware({ file: file as File });
  };

  useEffect(() => {
    if (uploadFirmwareData?.object_name) {
      form.setFieldsValue({ object_name: uploadFirmwareData.object_name });
    }
  }, [uploadFirmwareData, form]);

  return (
    <BaseEditSection title={t('common.uploadFirmware')} >
      <Flex
        vertical={true}
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', maxWidth: 600 }}
      >
        <Upload
          name="file"
          listType="picture-card"
          showUploadList={false}
          customRequest={handleUpload}
          style={{ width: '100%', height: 100 }}
        >
          <Flex
            vertical={true}
            gap={theme.custom.spacing.small}
            justify="center"
            align="center"
            style={{
              width: '100%',
              height: '100%',
              padding: theme.custom.spacing.medium,
            }}
          >
            {uploadFirmwareLoading ? (
              <Spin spinning={uploadFirmwareLoading} size="small" />
            ) : (
              <Button
                icon={<CloudUpload size={24} weight='BoldDuotone' />}
                type="text"
                size="large"
                style={{
                  color: theme.custom.colors.info.default,
                }}
              >
                {t('common.upload')}
              </Button>
            )}
          </Flex>
        </Upload>

        {uploadFirmwareData && (
          <Form
            form={form}
            layout="vertical"
            style={{
              width: '100%',
              maxWidth: 600,
            }}
            onValuesChange={(_, values) => onChange(values)}
          >
            <Form.Item
              name="object_name"
              rules={[{ required: true, message: t('messages.objectNameIsRequired') }]}
              style={{ width: '100%' }}
            >
              <Input 
                size="large" 
                readOnly
                value={uploadFirmwareData.object_name}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: theme.custom.colors.success.default,
                  fontWeight: theme.custom.fontWeight.large,
                }}
              />
            </Form.Item>
          </Form>
        )}

        {uploadFirmwareError && (
          <Typography.Text
            style={{
              color: theme.custom.colors.danger.default,
              fontSize: theme.custom.fontSize.small,
              textAlign: 'left',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
            }}
          >
            {t('messages.uploadFirmwareError')}
          </Typography.Text>
        )}
      </Flex>
    </BaseEditSection>
  );
};
