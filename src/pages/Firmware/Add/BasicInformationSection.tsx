import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Form,
  Input,
  Select,
  type FormInstance,
} from 'antd';

import { BaseEditSection } from '@shared/components/BaseEditSection';
import { FirmwareStatusEnum } from '@shared/enums/FirmwareStatusEnum';
import { DynamicTag } from '@shared/components/DynamicTag';
import { FirmwareVersionTypeEnum } from '@shared/enums/FirmwareVersionTypeEnum';

interface Props {
  form: FormInstance;
  onChange: (values: any) => void;
}

export const AddFirmwareBasicInformationSection: React.FC<Props> = ({ form, onChange }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    form.setFieldsValue({
      status: FirmwareStatusEnum.DRAFT,
      version_type: FirmwareVersionTypeEnum.PATCH,
    });
  }, []);

  return (
    <BaseEditSection title={t('common.basicInformation')}>
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%', maxWidth: 600 }}
        onValuesChange={(_, values) => onChange(values)}
      >
        <Form.Item name="name" label={t('common.name')} rules={[{ required: true, message: t('messages.nameIsRequired') }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item name="version" label={t('common.version')} rules={[{ required: true, message: t('messages.versionIsRequired') }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item name="description" label={t('common.description')} rules={[{ required: true, message: t('messages.descriptionIsRequired') }]}>
          <Input.TextArea size="large" />
        </Form.Item>

        <Form.Item name="status" label={t('common.status')} rules={[{ required: true, message: t('messages.statusIsRequired') }]}>
          <Select
            size="large"
            style={{ width: '100%' }}
            disabled
          >
            {Object.values(FirmwareStatusEnum).map((status) => (
              <Select.Option key={status} value={status} >
                <DynamicTag value={status} />
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="version_type" label={t('common.versionType')} rules={[{ required: true, message: t('messages.versionTypeIsRequired') }]}>
          <Select
            size="large"
            style={{ width: '100%' }}
            value={FirmwareVersionTypeEnum.PATCH}
          >
            {Object.values(FirmwareVersionTypeEnum).map((versionType) => (
              <Select.Option key={versionType as string} value={versionType as string}>
                <DynamicTag value={versionType} />
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </BaseEditSection>
  );
};
