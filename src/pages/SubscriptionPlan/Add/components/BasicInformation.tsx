import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Form,
  Input,
  Switch,
  type FormInstance,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  form: FormInstance<any>;
  onChange: (values: any) => void;
}

export const BasicInformation: React.FC<Props> = ({ form, onChange }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    form.setFieldsValue({
      name: '',
      description: '',
      is_enabled: true,
      is_default: false,
    });
  }, []);

  return (
    <BaseEditSection title={t('subscription.basicInformation')}>
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%', maxWidth: 600 }}
        onValuesChange={(_, values) => onChange(values)}
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
      </Form>
    </BaseEditSection>
  );
};
