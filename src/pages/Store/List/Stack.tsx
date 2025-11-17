import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, Typography, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { useListStoreApi, type ListStoreResponse } from '@shared/hooks/useListStoreApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Stack, StackCard } from '@shared/components/Stack';

export const StoreListStack: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [tableData, setTableData] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: listStoreData,
    loading: listStoreLoading,
    error: listStoreError,
    listStore,
  } = useListStoreApi<ListStoreResponse>();

  const handleListStore = () => {
    listStore({ page, page_size: pageSize });
  }

  useEffect(() => {
    if (listStoreData) {
      setTableData(listStoreData?.data.map((item) => ({
        id: item.id,
        name: item.name || '-',
        address: item.address || '-',
        contact_phone_number: item.contact_phone_number || '-',
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
    <PortalLayout title={t('common.storeList')}>
      {contextHolder}

      <Flex vertical style={{ height: '100%' }}>
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
