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

export const ResetPasswordSection: React.FC<Props> = ({ user, onSave }: Props) => {
  const { t } = useTranslation();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      password: '',
      passwordConfirm: '',
    });
  }, []);

  return (
    <BaseEditSection title={t('common.basicInformation')} onSave={() => onSave(form)}>
      <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 600 }}>
        <Form.Item
          label={t('common.password')}
          name="password"
          style={{ width: '100%' }}
          rules={[
            { required: true, message: t('messages.passwordIsRequired') },
            { min: 8, message: t('messages.passwordMustBeAtLeastEightCharacters') },
            {
              pattern: /[A-Z]/,
              message: t('messages.passwordMustContainUppercase'),
            },
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item
          label={t('common.passwordConfirm')}
          name="passwordConfirm"
          style={{ width: '100%' }}
          dependencies={['password']}
          rules={[
            { required: true, message: t('messages.passwordConfirmIsRequired') },
            { min: 8, message: t('messages.passwordConfirmMustBeAtLeastEightCharacters') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('messages.passwordConfirmError')));
              },
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
      </Form>
    </BaseEditSection>
  );
};
