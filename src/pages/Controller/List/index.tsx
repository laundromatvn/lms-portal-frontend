import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography, Table, Skeleton, notification, Popconfirm } from 'antd';

import { AddCircle, TrashBinTrash } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { useListControllerApi, type ListControllerResponse } from '@shared/hooks/useListControllerApi';
import { useDeleteControllerApi } from '@shared/hooks/useDeleteControllerApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Box } from '@shared/components/Box';

export const ControllerListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [dataSource, setDataSource] = useState<any[]>([]);

  const columns = [
    {
      title: t('common.storeName'),
      dataIndex: 'store_name',
      width: 156,
      render: (text: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/stores/${record.store_id}/detail`)}>
          {text || '-'}
        </Typography.Link>
      ),
    },
    { 
      title: t('common.deviceId'),
      dataIndex: 'device_id',
      width: 128,
      render: (text: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/controllers/${record.id}/detail`)}>
          {text || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.controllerName'),
      dataIndex: 'name',
      width: 256,
      render: (text: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/controllers/${record.id}/detail`)}>
          {text || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.totalRelays'),
      dataIndex: 'total_relays',
      width: 48,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 128,
      render: (text: string) => <DynamicTag value={text} />,
    },
    {
      title: t('common.firmware'),
      dataIndex: 'firmware_name',
      width: 128,
      render: (text: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/firmware/${record.firmware_id}/detail`)}>
          {`${record.firmware_name} (${record.firmware_version})` || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.actions'),
      dataIndex: 'actions',
      width: 128,
      render: (text: string, record: any) => (
        <Popconfirm
          title={t('controller.deleteControllerConfirm')}
          onConfirm={() => deleteController(record.id)}
          okText={t('common.delete')}
          cancelText={t('common.cancel')}
        >
          <Button type="link" danger loading={deleteControllerLoading}>
            <TrashBinTrash weight="Outline" color={theme.custom.colors.danger.default} />
          </Button>
        </Popconfirm>
      ),
    },
  ];

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
    <PortalLayout>
      {contextHolder}

      <Flex vertical style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('common.controllers')}</Typography.Title>

        <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <LeftRightSection
            left={null}
            right={(<>
              <Button
                type="primary"
                onClick={() => navigate('/controllers/abandoned')}>
                <AddCircle
                />
                {t('controller.registerAbandoned')}
              </Button>
            </>)}
          />

          {listControllerLoading && <Skeleton active />}

          <Table
            bordered
            dataSource={listControllerData?.data || []}
            columns={columns}
            loading={listControllerLoading || deleteControllerLoading}
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
          />
        </Box>
      </Flex>
    </PortalLayout>
  );
};
