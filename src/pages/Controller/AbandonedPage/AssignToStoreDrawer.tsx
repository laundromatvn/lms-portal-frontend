import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Drawer, Flex, Form, Button, notification, Select } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListStoreApi,
  type ListStoreResponse,
} from '@shared/hooks/useListStoreApi';
import {
  useAssignControllerApi,
  type AssignControllerResponse,
} from '@shared/hooks/useAssignControllerApi';

interface Props {
  deviceId: string;
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
}

export const AssignToStoreDrawer: React.FC<Props> = ({
  deviceId,
  isDrawerOpen,
  setIsDrawerOpen,
  onSave,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const {
    data: listStoreData,
    loading: listStoreLoading,
    listStore,
  } = useListStoreApi<ListStoreResponse>();

  const {
    assignController,
    loading: assignControllerLoading,
    data: assignControllerData,
    error: assignControllerError,
  } = useAssignControllerApi<AssignControllerResponse>();

  const handleAssignToStore = () => {
    assignController({
      device_id: deviceId,
      name: '',
      total_relays: 0,
      store_id: form.getFieldsValue().store_id,
    });
    onSave?.();
  }

  useEffect(() => {
    listStore({ page: 1, page_size: 100 });
  }, []);

  useEffect(() => {
    if (assignControllerData) {
      api.success({
        message: t('controller.assignToStoreSuccess'),
      });
    }
  }, [assignControllerData]);

  useEffect(() => {
    if (assignControllerError) {
      api.error({
        message: t('controller.assignToStoreError'),
      });
    }
  }, [assignControllerError]);

  return (
    <Drawer
      title={t('controller.assignToStore')}
      placement="right"
      onClose={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      width={480}
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
          <Select
            allowClear
            placeholder={t('common.selectStore')}
            loading={listStoreLoading}
            options={listStoreData?.data?.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            onChange={(value) => {
              form.setFieldsValue({ store_id: value });
            }}
          />
        </Flex>

        <Flex justify="flex-end" gap={theme.custom.spacing.medium} style={{ width: '100%', marginTop: 'auto' }}>
          <Button
            type="default"
            size="large"
            onClick={() => setIsDrawerOpen(false)}
            style={{ width: '100%' }}
          >
            {t('common.cancel')}
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={handleAssignToStore}
            loading={assignControllerLoading}
            style={{ width: '100%' }}
          >
            {t('controller.assignToStore')}
          </Button>
        </Flex>
      </Flex>
    </Drawer>
  );
};
