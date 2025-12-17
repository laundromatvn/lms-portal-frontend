import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography, Table, Skeleton, notification } from 'antd';

import { AddCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import { useListStoreApi, type ListStoreResponse } from '@shared/hooks/useListStoreApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import LeftRightSection from '@shared/components/LeftRightSection';
import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';

export const TableView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { title: t('common.tenantName'), dataIndex: 'tenant_name', width: 128 },
    { title: t('common.name'), dataIndex: 'name', width: 128,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/stores/${record.id}/detail`)}>
          {record.name || '-'}
        </Typography.Link>
      ),
    },
    { title: t('common.status'), dataIndex: 'status', width: 72,
      render: (_: string, record: any) => <DynamicTag value={record.status} /> },
      { title: t('common.contactPhoneNumber'), dataIndex: 'contact_phone_number', width: 128 },
      { title: t('common.address'), dataIndex: 'address', width: 400 },
  ];

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
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <Flex vertical style={{ height: '100%' }}>
        <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <LeftRightSection
            left={null}
            right={can('store.create') && (
              <Button
                type="primary"
                icon={<AddCircle color={theme.custom.colors.text.inverted} />}
                onClick={() => navigate('/stores/add')}
                size="large"
              >
                {t('common.addStore')}
              </Button>
            )}
          />

          {listStoreLoading && <Skeleton active />}

          {!listStoreLoading && (
            <Flex vertical style={{ width: '100%' }}>
              <Table
                bordered
                dataSource={listStoreData?.data || []}
                columns={columns}
                pagination={{
                  pageSize,
                  current: page,
                  total: listStoreData?.total,
                  onChange: (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                  },
                }}
              />
            </Flex>
          )}
        </Box>
      </Flex>
    </PortalLayoutV2>
  );
};
