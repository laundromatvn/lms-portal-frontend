import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  Form,
  Flex,
  Input,
  InputNumber,
  Select,
  Typography,
  type FormInstance,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { FirmwareStatusEnum } from '@shared/enums/FirmwareStatusEnum';
import { FirmwareVersionTypeEnum } from '@shared/enums/FirmwareVersionTypeEnum';
import type { Firmware } from '@shared/types/Firmware';

import { BaseEditSection } from '@shared/components/BaseEditSection';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  firmware: Firmware | null;
  onSave: (form: FormInstance) => void;
}

export const EditFirmwareBasicInformationSection: React.FC<Props> = ({ firmware, onSave }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  useEffect(() => {
    if (!firmware) return;

    form.setFieldsValue({
      id: firmware.id,
      name: firmware.name,
      version: firmware.version,
      description: firmware.description,
      version_type: firmware.version_type,
      object_name: firmware.object_name,
      file_size: firmware.file_size,
      checksum: firmware.checksum,
    });
  }, [firmware]);

  return (
    <BaseEditSection title={t('common.basicInformation')} onSave={() => onSave(form)}>
      <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 600 }}>
        <Form.Item
          label={t('common.name')}
          name="name"
          style={{ width: '100%' }}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.version')}
          name="version"
          style={{ width: '100%' }}
          rules={[
            { required: true, message: t('common.versionIsRequired') },
          ]}
        >
          <Input size="large" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('common.description')}
          name="description"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.descriptionIsRequired') }]}
        >
          <Input.TextArea size="large" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('common.versionType')}
          name="version_type"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.versionTypeIsRequired') }]}
        >
          <Select size="large" style={{ width: '100%' }}>
            {Object.values(FirmwareVersionTypeEnum).map((versionType) => (
              <Select.Option key={versionType} value={versionType} >
                <DynamicTag value={versionType} />
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </BaseEditSection>
  );
};
