import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Input, List, Typography, notification } from 'antd';

import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import { useListStoreApi, type ListStoreResponse } from '@shared/hooks/useListStoreApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { DynamicTag } from '@shared/components/DynamicTag';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';

export const MobileView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const {
    data: listStoreData,
    loading: listStoreLoading,
    error: listStoreError,
    listStore,
  } = useListStoreApi<ListStoreResponse>();

  const handleListStore = () => {
    const searchValue = search && search.length >= 3 ? search : undefined;

    listStore({
      page,
      page_size: pageSize,
      search: searchValue,
    });
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
  }, [page, pageSize, search]);

  return (
    <PortalLayoutV2
      title={t('common.storeList')}
      onBack={() => navigate('/')}
    >
      {contextHolder}

      <Flex
        gap={theme.custom.spacing.xsmall}
        style={{ marginBottom: theme.custom.spacing.medium }}
      >
        <Input
          size="large"
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
          allowClear
          prefix={<SearchOutlined />}
        />

        {can('store.create') && (
          <Button
            size="large"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => navigate('/stores/add')}
            style={{
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          />
        )}
      </Flex>

      <BaseDetailSection
        title={t('common.storeList')}
        onRefresh={handleListStore}
        style={{ width: '100%' }}
      >
        <List
          dataSource={listStoreData?.data || []}
          loading={listStoreLoading}
          style={{ width: '100%' }}
          pagination={{
            pageSize,
            current: page,
            total: listStoreData?.total,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            style: { color: theme.custom.colors.text.tertiary },
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          renderItem={(item) => (
            <List.Item
              onClick={() => navigate(`/stores/${item.id}/detail`)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: theme.custom.spacing.small,
                width: '100%',
                padding: theme.custom.spacing.small,
                marginBottom: theme.custom.spacing.medium,
                backgroundColor: theme.custom.colors.background.light,
                borderRadius: theme.custom.radius.medium,
                border: `1px solid ${theme.custom.colors.neutral[200]}`,
              }}
            >
              <Flex justify="space-between" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
                <Typography.Text
                  ellipsis
                  style={{
                    flex: 1,
                    minWidth: 0,
                    marginRight: theme.custom.spacing.xsmall,
                  }}
                >
                  {item.name}
                </Typography.Text>

                <Flex style={{ flexShrink: 0 }}>
                  <DynamicTag value={item.status} type="text" />
                </Flex>
              </Flex>

              <Typography.Text
                type="secondary"
                ellipsis
                style={{
                  width: '100%',
                  fontSize: theme.custom.fontSize.small,
                }}
              >
                {item.contact_phone_number} • {item.address}
              </Typography.Text>
            </List.Item>
          )}
        />
      </BaseDetailSection>
    </PortalLayoutV2 >
  );
}
