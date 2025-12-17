import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  List,
  Skeleton,
  Typography,
  notification,
  Popconfirm,
} from 'antd';

import { AddCircle, TrashBinTrash } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import { useListControllerApi, type ListControllerResponse } from '@shared/hooks/useListControllerApi';
import { useDeleteControllerApi } from '@shared/hooks/useDeleteControllerApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Box } from '@shared/components/Box';

export const ListView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: listControllerData,
    loading: listControllerLoading,
    error: listControllerError,
    listController,
  } = useListControllerApi<ListControllerResponse>();
  const {
    deleteController,
    data: deleteControllerData,
    error: deleteControllerError,
    loading: deleteControllerLoading,
  } = useDeleteControllerApi<void>();

  const handleListController = () => {
    listController({ page, page_size: pageSize });
  }

  useEffect(() => {
    if (!deleteControllerData) return;

    api.success({
      message: t('controller.deleteControllerSuccess'),
    });
    handleListController();
  }, [deleteControllerData]);

  useEffect(() => {
    if (deleteControllerError) {
      api.error({
        message: t('controller.deleteControllerError'),
      });
    }
  }, [deleteControllerError]);

  useEffect(() => {
    if (listControllerError) {
      api.error({
        message: t('controller.listControllerError'),
      });
    }
  }, [listControllerError]);

  useEffect(() => {
    handleListController();
  }, [page, pageSize]);

  return (
    <PortalLayoutV2
      title={t('common.controllers')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%', height: '100%', overflowX: 'hidden' }}>
        <Flex justify="flex-end" wrap gap={theme.custom.spacing.small} style={{ width: '100%' }}>
          {can('controller.create') && (
            <Button
              onClick={() => navigate('/controllers/abandoned')}
              icon={<AddCircle />}
            >
              {t('controller.addController')}
            </Button>
          )}
        </Flex>

        {listControllerLoading && <Skeleton active />}

        <Flex vertical style={{ width: '100%', height: '100%', overflowX: 'auto' }}>
          <List
            dataSource={listControllerData?.data || []}
            loading={listControllerLoading}
            pagination={{
              pageSize,
              current: page,
              total: listControllerData?.total,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            style={{ width: '100%' }}
            renderItem={(item) => (
              <List.Item
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: theme.custom.spacing.small,
                  width: '100%',
                  padding: theme.custom.spacing.medium,
                  marginBottom: theme.custom.spacing.medium,
                  backgroundColor: theme.custom.colors.background.light,
                  borderRadius: theme.custom.radius.medium,
                  border: `1px solid ${theme.custom.colors.neutral[200]}`,
                }}
              >
                <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                  <Typography.Link onClick={() => navigate(`/controllers/${item.id}/detail`)}>
                    {item.name} ({item.device_id})
                  </Typography.Link>

                  <DynamicTag value={item.status} />
                </Flex>

                <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                  <Typography.Text type="secondary">{t('common.totalRelays')}: {item.total_relays}</Typography.Text>

                  <Typography.Text type="secondary">{item.store_name}</Typography.Text>
                </Flex>

                <Flex justify="end" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                  {can('controller.delete') && (
                    <Popconfirm
                      title={t('controller.deleteControllerConfirm')}
                      onConfirm={() => deleteController(item.id)}
                      okText={t('common.delete')}
                      cancelText={t('common.cancel')}
                    >
                      <Button
                        icon={<TrashBinTrash />}
                        loading={deleteControllerLoading}
                        style={{
                          color: theme.custom.colors.danger.default,
                          backgroundColor: theme.custom.colors.danger.light,
                          border: 'none',
                        }}
                      >
                        {t('common.delete')}
                      </Button>
                    </Popconfirm>
                  )}
                </Flex>
              </List.Item>
            )}
          />
        </Flex>
      </Box>
    </PortalLayoutV2>
  );
};
