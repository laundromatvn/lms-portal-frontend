import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Skeleton, Typography, notification, Form, Select, Input, InputNumber, Button } from 'antd';

import { tenantStorage } from '@core/storage/tenantStorage';

import { useListStoreApi, type ListStoreResponse } from '@shared/hooks/useListStoreApi';
import { useAssignControllerApi, type AssignControllerResponse } from '@shared/hooks/useAssignControllerApi';
import LeftRightSection from '@shared/components/LeftRightSection';

interface Props {
  controllerId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AssignToStoreModalContent: React.FC<Props> = ({ controllerId, setIsOpen }) => {
  const { t } = useTranslation();

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

  const handleListStore = () => {
    const tenant = tenantStorage.load();
    if (!tenant) return;

    listStore({ tenant_id: tenant.id, page: 1, page_size: 100 });
  }

  const handleAssignToStore = () => {
    const tenant = tenantStorage.load();
    if (!tenant) return;

    assignController({ 
      device_id: controllerId,
      name: form.getFieldValue('name'),
      total_relays: form.getFieldValue('total_relays'),
      store_id: form.getFieldValue('store_id'),
    });
  }

  useEffect(() => {
    if (assignControllerError) {
      api.error({
        message: t('controller.assignToStoreError'),
      });
    }
  }, [assignControllerError]);

  useEffect(() => {
    if (assignControllerData) {
      setIsOpen(false);
      api.success({
        message: t('controller.assignToStoreSuccess'),
      });
    }
  }, [assignControllerData]);

  useEffect(() => {
    handleListStore();
  }, []);

  return (
    <Flex vertical style={{ height: '100%' }}>
      {contextHolder}

      <Typography.Title level={2}>{t('controller.assignToStore')}</Typography.Title>

      {listStoreLoading ? (
        <Skeleton active />
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            name="id"
            label={t('common.deviceId')}
          >
            <Input size="large" defaultValue={controllerId} disabled />
          </Form.Item>
          
          <Form.Item
            name="name"
            label={t('common.name')}
          >
            <Input size="large" placeholder={t('messages.enterName')} />
          </Form.Item>

          <Form.Item
            label={t('common.totalRelays')}
            name="total_relays"
            rules={[{
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(new Error(t('common.totalRelaysMustBeGreaterThanZero')));
                }
                if (value > 12) {
                  return Promise.reject(new Error(t('common.totalRelaysMustBeLessThanTwelve')));
                }
                return Promise.resolve();
              }
            }]}
          >
            <InputNumber size="large" style={{ width: '100%' }} defaultValue={1} />
          </Form.Item>

          <Form.Item
            label={t('common.store')}
            name="store_id"
            rules={[{ required: true, message: t('common.storeIsRequired') }]}
          >
            <Select
              size="large"
              options={listStoreData?.data.map((item) => ({ label: item.name, value: item.id }))}
              loading={listStoreLoading}
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="end" align="center" style={{ width: '100%' }}>

            <Button
            type="primary"
            size="large"
            onClick={handleAssignToStore}
            loading={assignControllerLoading}
            style={{ minWidth: 128 }}
            >
              {t('common.assign')}
            </Button>
            </Flex>
          </Form.Item>
        </Form>
      )}

      <LeftRightSection
        left={null}
        right={null}
      />
    </Flex>
  )
};
