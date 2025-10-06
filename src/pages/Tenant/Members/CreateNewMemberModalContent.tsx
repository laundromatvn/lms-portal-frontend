import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Input,
  Form,
  Typography,
  notification,
  Button,
  Select,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { UserRoleEnum } from '@shared/enums/UserRoleEnum';
import { UserStatusEnum } from '@shared/enums/UserStatusEnum';

import {
  useCreateTenantMemberApi,
  type CreateTenantMemberResponse,
} from '@shared/hooks/useCreateTenantMemberApi';
import {
  useCreateUserApi,
  type CreateUserResponse,
} from '@shared/hooks/useCreateUserApi';

import { Box } from '@shared/components/Box';

interface Props {
  tenant_id: string;
  onClose: () => void;
}

export const CreateNewMemberModalContent: React.FC<Props> = ({ tenant_id, onClose }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const handleCreateUser = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      createUser({
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.role || UserRoleEnum.TENANT_STAFF,
        status: values.status || UserStatusEnum.ACTIVE,
      });
    } catch (error) {
      return;
    }
  }

  const handleCreateTenantMember = async () => {
    try {
      createTenantMember({
        user_id: createUserData?.id || '',
        tenant_id: tenant_id,
      });
    } catch (error) {
      return;
    }
  }

  const {
    createUser,
    data: createUserData,
    loading: createUserLoading,
    error: createUserError,
  } = useCreateUserApi<CreateUserResponse>();
  const {
    createTenantMember,
    data: createTenantMemberData,
    loading: createTenantMemberLoading,
    error: createTenantMemberError,
  } = useCreateTenantMemberApi<CreateTenantMemberResponse>();

  useEffect(() => {
    if (createUserError) {
      api.error({
        message: t('messages.createUserError'),
      });
    }
  }, [createUserError]);

  useEffect(() => {
    if (createTenantMemberError) {
      api.error({
        message: t('messages.createTenantMemberError'),
      });
    }
  }, [createTenantMemberError]);

  useEffect(() => {
    if (createUserData) {
      handleCreateTenantMember();
    }
  }, [createUserData]);

  useEffect(() => {
    if (createTenantMemberData) {
      onClose();
    }
  }, [createTenantMemberData]);

  useEffect(() => {
    form.setFieldsValue({
      email: '',
      password: '',
      passwordConfirm: '',
      phone: '',
      role: UserRoleEnum.TENANT_STAFF,
      status: UserStatusEnum.ACTIVE,
    });
  }, []);

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%', height: '100%' }}>
      {contextHolder}

      <Typography.Title level={3}>{t('common.createNewMember')}</Typography.Title>

      <Box
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', height: '100%', overflowY: 'auto' }}
      >
        <Form
          style={{
            width: '100%',
            maxWidth: 600,
          }}
          form={form}
          layout="vertical"
        >
          <Form.Item
            label={t('common.email')}
            name="email"
            rules={[{ required: true, message: t('messages.emailIsRequired') }]}
          >
            <Input size="large" placeholder={t('common.email')} />
          </Form.Item>

          <Form.Item
            label={t('common.password')}
            name="password"
            rules={[
              { required: true, message: t('messages.passwordIsRequired') },
              { min: 8, message: t('messages.passwordMustBeAtLeastEightCharacters') },
              {
                pattern: /[A-Z]/,
                message: t('messages.passwordMustContainUppercase'),
              },
              {
                pattern: /[a-z]/,
                message: t('messages.passwordMustContainLowercase'),
              },
              {
                pattern: /[0-9]/,
                message: t('messages.passwordMustContainNumber'),
              },
              {
                pattern: /[^A-Za-z0-9]/,
                message: t('messages.passwordMustContainSpecialCharacter'),
              },
            ]}
          >
            <Input.Password size="large" placeholder={t('common.password')} />
          </Form.Item>

          <Form.Item
            label={t('common.passwordConfirm')}
            name="passwordConfirm"
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
            <Input.Password size="large" placeholder={t('common.passwordConfirm')} />
          </Form.Item>

          <Form.Item
            label={t('common.phone')}
            name="phone"
          >
            <Input size="large" placeholder={t('common.phone')} />
          </Form.Item>

          <Form.Item
            label={t('common.role')}
            name="role"
            rules={[{ required: true, message: t('messages.roleIsRequired') }]}
          >
            <Select
              size="large"
              placeholder={t('common.role')}
              options={[
                { label: t('common.tenant_admin'), value: UserRoleEnum.TENANT_ADMIN },
                { label: t('common.tenant_staff'), value: UserRoleEnum.TENANT_STAFF },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={t('common.status')}
            name="status"
            rules={[{ required: true, message: t('messages.statusIsRequired') }]}
          >
            <Select
              size="large"
              placeholder={t('common.status')}
              options={[
                { label: t('common.active'), value: UserStatusEnum.ACTIVE },
                { label: t('common.inactive'), value: UserStatusEnum.INACTIVE },
              ]}
            />
          </Form.Item>

          <Form.Item style={{ width: '100%', textAlign: 'right' }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ minWidth: 128 }}
              onClick={handleCreateUser}
              loading={createUserLoading || createTenantMemberLoading}
            >
              {t('common.createNewMember')}
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </Flex>
  );
};
