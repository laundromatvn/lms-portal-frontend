import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Form,
  Input,
  Switch,
  type FormInstance,
} from 'antd';

import { type PermissionGroup } from '@shared/types/PermissionGroup';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  permissionGroup: PermissionGroup | null;
  onSave: (form: FormInstance) => void;
}

export const BasicInformationEdit: React.FC<Props> = ({ permissionGroup, onSave }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSave = async () => {
    await form.validateFields();
    onSave(form);
  };

  useEffect(() => {
    form.setFieldsValue({
      name: permissionGroup?.name,
      description: permissionGroup?.description,
      is_enabled: permissionGroup?.is_enabled,
    });
  }, [permissionGroup]);

  return (
    <BaseEditSection
      title={t('common.basicInformation')}
      loading={permissionGroup === null}
      onSave={handleSave}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%', maxWidth: 600 }}
        onValuesChange={(_, values) => form.setFieldsValue(values)}
      >
        <Form.Item
          label={t('common.name')}
          name="name"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.nameIsRequired') }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.description')}
          name="description"
          style={{ width: '100%' }}
        >
          <Input.TextArea size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.isEnabled')}
          name="is_enabled"
          style={{ width: '100%' }}
        >
          <Switch
            checked={permissionGroup?.is_enabled}
            onChange={(value: boolean) => form.setFieldsValue({ is_enabled: value })}
          />
        </Form.Item>
      </Form>
    </BaseEditSection>
  );
};
