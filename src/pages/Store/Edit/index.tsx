import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Button,
  Flex,
  Typography,
  Skeleton,
  notification,
  type FormInstance,
  Form,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Store } from '@shared/types/store';

import {
  useGetStoreApi,
  type GetStoreResponse,
} from '@shared/hooks/useGetStoreApi';
import {
  useUpdateStoreApi,
  type UpdateStoreResponse,
} from '@shared/hooks/useUpdateStoreApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DetailEditSection } from './DetailEditSection';

export const StoreEditPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const storeId = useParams().id as string;

  const [form] = Form.useForm();

  const {
    getStore,
    data: storeData,
    loading: storeLoading,
    error: storeError,
  } = useGetStoreApi<GetStoreResponse>();
  const {
    updateStore,
    data: updateStoreData,
    loading: updateStoreLoading,
    error: updateStoreError,
  } = useUpdateStoreApi<UpdateStoreResponse>();

  const onSave = () => {
    const payload = {
      name: form.getFieldValue('name'),
      address: form.getFieldValue('address'),
      contact_phone_number: form.getFieldValue('contact_phone_number'),
      status: form.getFieldValue('status'),
      tenant_id: form.getFieldValue('tenant_id'),
    }
    updateStore(storeId, payload);
  }

  useEffect(() => {
    if (storeError) {
      api.error({
        message: t('messages.getStoreError'),
      });
    }
  }, [storeError]);

  useEffect(() => {
    if (updateStoreError) {
      api.error({
        message: t('messages.updateStoreError'),
      });
    }
  }, [updateStoreError]);

  useEffect(() => {
    if (updateStoreData) {
      api.success({
        message: t('messages.updateStoreSuccess'),
      });
    }
  }, [updateStoreData]);

  useEffect(() => {
    if (storeId) {
      getStore(storeId);
    }
  }, [storeId]);

  useEffect(() => {
    storeData && form.setFieldsValue({
      name: storeData.name,
      address: storeData.address,
      contact_phone_number: storeData.contact_phone_number,
      status: storeData.status,
    });
  }, [storeData]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>Store Edit</Typography.Title>

        <LeftRightSection
          left={(
            <Button
              type="default"
              size="large"
              onClick={() => navigate(`/stores/${storeId}/detail`)}>
              {t('common.back')}
            </Button>
          )}
          right={(
            <Button
              type="primary"
              size="large"
              onClick={onSave}
              style={{ minWidth: 128 }}
            >
              {t('common.save')}
            </Button>
          )}
        />

        {storeLoading && <Skeleton active />}

        {!storeLoading && storeData && (
          <>
            <DetailEditSection
              store={storeData as Store}
              onChange={(values) => form.setFieldsValue(values)}
            />
          </>
        )}
      </Flex>
    </PortalLayout>
  );
};
