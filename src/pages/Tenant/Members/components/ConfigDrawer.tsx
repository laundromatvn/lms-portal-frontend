import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Drawer, Flex, Button, notification, Input, Form, Select, Skeleton } from 'antd';

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

interface Props {
  user_id: string;
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}

export const ConfigDrawer: React.FC<Props> = ({
  user_id,
  isDrawerOpen,
  setIsDrawerOpen,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

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
    try {
      await form.validateFields();
      updateUser(user_id, form.getFieldsValue());
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (isDrawerOpen && user_id) {
      getUser(user_id);
    }
  }, [isDrawerOpen, user_id]);

  useEffect(() => {
    if (!userError) return;

    api.error({
      message: t('messages.getUserError'),
    });
  }, [userError]);

  useEffect(() => {
    if (!updateUserError) return;

    api.error({
      message: t('messages.updateUserError'),
    });
  }, [updateUserError]);

  useEffect(() => {
    if (!updateUserData) return;

    setIsDrawerOpen(false);

    api.success({
      message: t('messages.updateUserSuccess'),
    });

    onSuccess?.();
  }, [updateUserData]);

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

  return (
    <Drawer
      title={t('common.userConfig')}
      placement="right"
      onClose={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      width={600}
      styles={{
        body: {
          padding: theme.custom.spacing.medium,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {contextHolder}

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', height: '100%' }}
      >
        <Flex
          vertical
          gap={theme.custom.spacing.medium}
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
          }}
        >
          {userLoading && <Skeleton active />}

          {!userLoading && userData && (
            <Form
              style={{
                width: '100%',
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
                rules={[{ required: true, message: t('messages.phoneIsRequired') }]}
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
            </Form>
          )}
        </Flex>

        <Flex justify="flex-end" gap={theme.custom.spacing.medium} style={{ width: '100%', marginTop: 'auto' }}>
          <Button
            type="default"
            size="large"
            onClick={() => setIsDrawerOpen(false)}
            style={{ width: '100%' }}
            disabled={userLoading}
          >
            {t('common.cancel')}
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={handleUpdateUser}
            loading={updateUserLoading}
            disabled={userLoading || !userData}
            style={{ width: '100%' }}
          >
            {t('common.update')}
          </Button>
        </Flex>
      </Flex>
    </Drawer>
  );
};

