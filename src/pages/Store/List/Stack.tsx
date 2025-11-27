import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography, notification } from 'antd';

import { AddCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { PortalStoreAccess } from '@shared/types/access/PortalStore';

import { useListStoreApi, type ListStoreResponse } from '@shared/hooks/useListStoreApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Stack, StackCard } from '@shared/components/Stack';

interface Props {
  access: PortalStoreAccess;
}

export const StoreListStack: React.FC<Props> = ({ access }) => {
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
    <PortalLayoutV2
      title={t('common.storeList')}
      onBack={() => navigate('/')}
    >
      {contextHolder}

      <Flex vertical style={{ width: '100%', marginBottom: theme.custom.spacing.medium }}>
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
      </Flex>

      {access?.portal_store_basic_view && (
        <Flex vertical >
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
      )}
    </PortalLayoutV2 >
  );
}
