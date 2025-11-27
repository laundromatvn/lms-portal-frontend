import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography, Table, Skeleton, notification } from 'antd';

import { AddCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { PortalStoreAccess } from '@shared/types/access/PortalStore';

import { useListStoreApi, type ListStoreResponse } from '@shared/hooks/useListStoreApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import LeftRightSection from '@shared/components/LeftRightSection';
import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  access: PortalStoreAccess;
}

export const StoreListTable: React.FC<Props> = ({ access }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

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
    listStore({ page, page_size: pageSize });
  }

  useEffect(() => {
    if (listStoreData) {
      setTableData(listStoreData?.data.map((item) => ({
        name: <Typography.Link onClick={() => navigate(`/stores/${item.id}/detail`)}>{item.name || '-'}</Typography.Link>,
        address: item.address || '-',
        contact_phone_number: item.contact_phone_number || '-',
        tenant_name: item.tenant_name || '-',
        status: <DynamicTag value={item.status} />,
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
    <PortalLayoutV2
      title={t('common.storeList')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      {access?.portal_store_basic_view && (
        <Flex vertical style={{ height: '100%' }}>
          <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
            <LeftRightSection
              left={null}
              right={(
                <>
                  {access?.portal_store_management && (
                    <Button
                      type="primary"
                      icon={<AddCircle color={theme.custom.colors.text.inverted} />}
                      onClick={() => navigate('/stores/add')}
                      size="large"
                    >
                      {t('common.addStore')}
                    </Button>
                  )}
                </>
              )}
            />

            {listStoreLoading && <Skeleton active />}

            {!listStoreLoading && (
              <Flex vertical style={{ width: '100%' }}>
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
          </Box>
        </Flex>
      )}
    </PortalLayoutV2>
  );
};
