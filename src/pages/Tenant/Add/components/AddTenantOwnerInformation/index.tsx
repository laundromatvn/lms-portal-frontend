import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, Input, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useCreateUserApi,
} from '@shared/hooks/useCreateUserApi';

import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

import { type User } from '@shared/types/user';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  onSave: (newTenantOwner: User) => void;
}

export const AddTenantOwnerInformation: React.FC<Props> = ({ onSave }: Props) => {
  const { t } = useTranslation();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const {
    createUser,
    data: createUserData,
    loading: createUserLoading,
    error: createUserError,
  } = useCreateUserApi<User>();

  const handleSave = async () => {
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }

    await createUser({
      email: form.getFieldValue('email'),
      phone: form.getFieldValue('phone'),
      password: form.getFieldValue('password'),
      role: UserRoleEnum.TENANT_ADMIN,
    });
  };

  useEffect(() => {
    if (createUserData) {
      onSave(createUserData as User);
    }
  }, [createUserData]);

  useEffect(() => {
    if (createUserError) {
      api.error({
        message: t('tenant.messages.createOwnerAccountError'),
      });
    }
  }, [createUserError]);

  return (
    <BaseEditSection
      title={t('tenant.ownerAccount')}
      saveButtonText={t('common.continue')}
      onSave={handleSave}
      loading={createUserLoading}
    >
      {contextHolder}

      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%', maxWidth: 600 }}
      >
        <Form.Item
          name="email"
          label={t('common.email')}
          rules={[{ required: true, message: t('messages.emailIsRequired') }]}
          style={{ width: '100%' }}
        >
          <Input size="large" type="email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t('common.phone')}
          rules={[{ required: true, message: t('messages.phoneIsRequired') }]}
          style={{ width: '100%' }}
        >
          <Input size="large" type="tel" />
        </Form.Item>

        <Form.Item
          name="password"
          label={t('common.password')}
          rules={[
            {
              required: true,
              message: t('messages.passwordIsRequired'),
            }, {
              min: 8,
              message: t('messages.passwordMustBeAtLeastEightCharacters'),
            }
          ]}
          style={{ width: '100%' }}
        >
          <Input size="large" type="password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={t('common.confirmPassword')}
          rules={[
            {
              required: true,
              message: t('messages.confirmPasswordIsRequired'),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('messages.passwordConfirmError')));
              },
            }),
          ]}
          style={{ width: '100%' }}
        >
          <Input size="large" type="password" />
        </Form.Item>
      </Form>
    </BaseEditSection>
  )
};
