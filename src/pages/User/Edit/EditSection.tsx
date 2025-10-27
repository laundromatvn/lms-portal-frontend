import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Form,
  Input,
  type FormInstance,
} from 'antd';

import { type User } from '@shared/types/user';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  user: User;
  onSave: (form: FormInstance) => void;
}

export const EditSection: React.FC<Props> = ({ user, onSave }: Props) => {
  const { t } = useTranslation();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      id: user.id,
      email: user.email,
      phone: user.phone,
    });
  }, []);

  return (
    <BaseEditSection title={t('common.basicInformation')} onSave={() => onSave(form)}>
      <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 600 }}>
        <Form.Item
          label={t('common.email')}
          name="email"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.emailIsRequired') }]}
        >
          <Input size="large" disabled />
        </Form.Item>

        <Form.Item
          label={t('common.phone')}
          name="phone"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('common.phoneIsRequired') }]}
        >
          <Input size="large" />
        </Form.Item>
      </Form>
    </BaseEditSection>
  );
};
