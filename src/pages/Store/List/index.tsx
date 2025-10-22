import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography, Table, Skeleton, notification } from 'antd';

import {
  Eye,
  Settings
} from '@solar-icons/react'

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';

import { useListStoreApi, type ListStoreResponse } from '@shared/hooks/useListStoreApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';

export const StoreListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const tenant = tenantStorage.load();

  const [api, contextHolder] = notification.useNotification();

  const [tableData, setTableData] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { title: 'Tenant ID', dataIndex: 'tenant_id', width: 200 },
    { title: 'ID', dataIndex: 'id', width: 200 },
    { title: 'Name', dataIndex: 'name', width: 400 },
    { title: 'Address', dataIndex: 'address', width: 400 },
    { title: 'Contact Phone Number', dataIndex: 'contact_phone_number', width: 200 },
    { title: 'Status', dataIndex: 'status', width: 200 },
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
        tenant_id: item.tenant_id || '-',
        status: <DynamicTag value={item.status} />,
        actions: (
          <Flex gap={theme.custom.spacing.small}>
            <Button
              type="link"
              onClick={() => {
                navigate(`/stores/${item.id}/detail`);
              }}
            >
              <Eye />
            </Button>
            <Button
              type="link"
              onClick={() => {
                navigate(`/stores/${item.id}/edit`);
              }}
            >
              <Settings />
            </Button>
          </Flex>
        ),
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
        <Typography.Title level={2}>Store List</Typography.Title>

        <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
          <LeftRightSection
            left={null}
            right={(
              <>
                <Button
                  type="default"
                  size="large"
                  onClick={() => navigate('/stores/add')}>
                  {t('common.addStore')}
                </Button>
              </>
            )}
          />

          {listStoreLoading && <Skeleton active />}

          {!listStoreLoading && (
            <Flex vertical gap={theme.custom.spacing.large}>
              <Table
                bordered
                dataSource={tableData || []}
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
        </Flex>
      </Flex>
    </PortalLayout>
  );
};
