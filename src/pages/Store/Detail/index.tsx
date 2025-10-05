import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Flex, Typography, Skeleton, notification } from 'antd';

import {
  useGetStoreApi,
  type GetStoreResponse,
} from '@shared/hooks/useGetStoreApi';

import { useTheme } from '@shared/theme/useTheme';

import { type Store } from '@shared/types/store';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DetailSection } from './DetailSection';
import { ControllerListSection } from './ControllerListSection';
import { MachineListSection } from './MachineListSection';

export const StoreDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const storeId = useParams().id;

  const {
    getStore,
    data: storeData,
    loading: storeLoading,
    error: storeError,
  } = useGetStoreApi<GetStoreResponse>();

  useEffect(() => {
    if (storeError) {
      api.error({
        message: t('store.getStoreError'),
      });
    }
  }, [storeError]);

  useEffect(() => {
    if (storeId) {
      getStore(storeId);
    }
  }, [storeId]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>Store Detail</Typography.Title>

        <LeftRightSection
          left={null}
          right={(<>
            <Button type="default" size="large" onClick={() => navigate(`/stores/${storeId}/edit`)}>
              {t('common.edit')}
            </Button>
          </>)}
        />

        {storeLoading && <Skeleton active />}

        {!storeLoading && storeData && (
          <>
            <DetailSection store={storeData as Store} />
            <ControllerListSection store={storeData as Store} />
            <MachineListSection store={storeData as Store} />
          </>
        )}
      </Flex>
    </PortalLayout>
  );
};
