import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, List, Typography, notification } from 'antd';

import { AddCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import { useListStoreApi, type ListStoreResponse } from '@shared/hooks/useListStoreApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { DynamicTag } from '@shared/components/DynamicTag';

export const ListView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

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
    <PortalLayoutV2
      title={t('common.storeList')}
      onBack={() => navigate('/')}
    >
      {contextHolder}

      <Flex vertical style={{ width: '100%', marginBottom: theme.custom.spacing.medium }}>
        {can('store.create') && (
          <Button
            type="primary"
            icon={<AddCircle color={theme.custom.colors.text.inverted} />}
            onClick={() => navigate('/stores/add')}
            size="large"
          >
            {t('common.addStore')}
          </Button>
        )}
      </Flex>

      <Flex vertical >
        <List
          dataSource={listStoreData?.data || []}
          loading={listStoreLoading}
          pagination={{
            pageSize,
            current: page,
            total: listStoreData?.total,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          renderItem={(item) => (
            <List.Item
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: theme.custom.spacing.small,
                width: '100%',
                padding: theme.custom.spacing.large,
                marginBottom: theme.custom.spacing.medium,
                backgroundColor: theme.custom.colors.background.light,
                borderRadius: theme.custom.radius.medium,
                border: `1px solid ${theme.custom.colors.neutral[200]}`,
              }}
            >
              <Flex justify="space-between" wrap="wrap" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
                <Typography.Link onClick={() => navigate(`/stores/${item.id}/detail`)} strong>
                  {item.name}
                </Typography.Link>

                <DynamicTag value={item.status} />
              </Flex>

              <Flex justify="space-between" wrap="wrap" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
                <Typography.Text type="secondary">{item.contact_phone_number}</Typography.Text>

                <Typography.Text type="secondary">{item.address}</Typography.Text>
              </Flex>
            </List.Item>
          )}
        />
      </Flex>
    </PortalLayoutV2 >
  );
}
