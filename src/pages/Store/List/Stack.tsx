import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, Typography, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';

import { useListStoreApi, type ListStoreResponse } from '@shared/hooks/useListStoreApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Stack, StackCard } from '@shared/components/Stack';

export const StoreListStack: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const tenant = tenantStorage.load();

  const [api, contextHolder] = notification.useNotification();

  const [tableData, setTableData] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { title: t('common.tenantName'), dataIndex: 'tenant_name', width: 128 },
    { title: t('common.name'), dataIndex: 'name', width: 256 },
    { title: t('common.status'), dataIndex: 'status', width: 72 },
    { title: t('common.address'), dataIndex: 'address', width: 400 },
    { title: t('common.contactPhoneNumber'), dataIndex: 'contact_phone_number', width: 128 },
  ];

  const {
    data: listStoreData,
    loading: listStoreLoading,
    error: listStoreError,
    listStore,
  } = useListStoreApi<ListStoreResponse>();

  const handleListStore = () => {
    if (tenant) {
      listStore({ tenant_id: tenant.id, page, page_size: pageSize });
    } else {
      listStore({ page, page_size: pageSize });
    }
  }

  useEffect(() => {
    if (listStoreData) {
      setTableData(listStoreData?.data.map((item) => ({
        id: item.id,
        name: item.name || '-',
        address: item.address || '-',
        contact_phone_number: item.contact_phone_number || '-',
        tenant_name: item.tenant_name || '-',
        status: item.status,
      })));
    }
  }, [listStoreData]);

  useEffect(() => {
    if (listStoreError) {
      api.error({
        message: t('store.listStoreError'),
      });
    }
  }, [listStoreError]);

  useEffect(() => {
    handleListStore();
  }, [page, pageSize]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('common.storeList')}</Typography.Title>

        <Stack
          data={tableData || []}
          renderItem={(item) => (
            <StackCard>
              <StackCard.Header>
                <Typography.Link
                  onClick={() => navigate(`/stores/${item.id}/detail`)}
                  style={{ fontSize: theme.custom.fontSize.large, fontWeight: 500 }}
                >
                  {item.name}
                </Typography.Link>
              </StackCard.Header>

              <StackCard.Content>
                <Flex justify="space-between" wrap="wrap" gap={theme.custom.spacing.xsmall}>
                  <DynamicTag value={item.status} />
                </Flex>

                <Typography.Text type="secondary">{item.contact_phone_number} | {item.address}</Typography.Text>
              </StackCard.Content>
            </StackCard>
          )}
        />
      </Flex>
    </PortalLayout>
  );
};
