import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Form,
  Input,
  Switch,
  type FormInstance,
} from 'antd';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  onSave: (form: FormInstance) => void;
}

export const BasicInformationAdd: React.FC<Props> = ({ onSave }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  return (
    <BaseEditSection
      title={t('common.basicInformation')}
      onSave={() => onSave(form)}
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
            defaultChecked
          />
        </Form.Item>
      </Form>
    </BaseEditSection>
  );
};
