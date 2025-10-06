import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Input, Form, Typography, notification, Select, Skeleton, Button } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { UserStatusEnum } from '@shared/enums/UserStatusEnum';
import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

import {
  useGetUserApi,
  type GetUserResponse,
} from '@shared/hooks/useGetUserApi';
import {
  useUpdateUserApi,
  type UpdateUserResponse,
} from '@shared/hooks/useUpdateUserApi';

import { Box } from '@shared/components/Box';

interface Props {
  user_id: string;
  onClose: () => void;
}

export const ConfigModalContent: React.FC<Props> = ({ user_id, onClose }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const {
    getUser,
    data: userData,
    loading: userLoading,
    error: userError,
  } = useGetUserApi<GetUserResponse>();

  const {
    updateUser,
    data: updateUserData,
    loading: updateUserLoading,
    error: updateUserError,
  } = useUpdateUserApi<UpdateUserResponse>();

  const handleUpdateUser = async () => {
    updateUser(user_id, form.getFieldsValue());
  }

  useEffect(() => {
    if (user_id) {
      getUser(user_id);
    }
  }, []);

  useEffect(() => {
    if (userError) {
      api.error({
        message: t('messages.getUserError'),
      });
    }
  }, [userError]);

  useEffect(() => {
    if (updateUserError) {
      api.error({
        message: t('messages.updateUserError'),
      });
    }
  }, [updateUserError]);

  useEffect(() => {
    if (updateUserData) {
      api.success({
        message: t('messages.updateUserSuccess'),
      });

      onClose?.();
    }
  }, [updateUserData]);

  useEffect(() => {
    if (userData && updateUserData) {
      api.success({
        message: t('messages.updateUserSuccess'),
      });
    }
  }, [userData, updateUserData]);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
      });
    }
  }, [userData]);

  useEffect(() => {
    form.setFieldsValue({
      email: '',
      phone: '',
      role: '',
      status: '',
    });
  }, []);

  return (
    <Flex vertical gap={theme.custom.spacing.medium}>
      {contextHolder}

      <Typography.Title level={3}>{t('common.userConfig')}</Typography.Title>

      <Box
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', height: '100%', overflowY: 'auto' }}
      >
        {userLoading && <Skeleton active />}

        {!userLoading && userData && (
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
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label={t('common.phone')}
              name="phone"
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label={t('common.role')}
              name="role"
              rules={[{ required: true, message: t('messages.roleIsRequired') }]}
            >
              <Select
                size="large"
                style={{ width: '100%' }}
                options={[
                  { label: t('common.admin'), value: UserRoleEnum.ADMIN },
                  { label: t('common.tenant_admin'), value: UserRoleEnum.TENANT_ADMIN },
                  { label: t('common.tenant_staff'), value: UserRoleEnum.TENANT_STAFF },
                  { label: t('common.customer'), value: UserRoleEnum.CUSTOMER },
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
                style={{ width: '100%' }}
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
                loading={updateUserLoading}
                style={{ minWidth: 128 }}
                onClick={handleUpdateUser}
              >
                {t('common.update')}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Box>
    </Flex>
  );
};
