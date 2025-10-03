import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography, Table, Skeleton, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { useListControllerApi, type ListControllerResponse } from '@shared/hooks/useListControllerApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';

export const ControllerListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [dataSource, setDataSource] = useState<any[]>([]);

  const columns = [
    { title: 'Device ID', dataIndex: 'device_id', width: 100 },
    { title: 'Store Name', dataIndex: 'store_name', width: 300 },
    { title: 'Name', dataIndex: 'name', width: 300 },
    { title: 'Total Relays', dataIndex: 'total_relays', width: 100 },
    { title: 'Status', dataIndex: 'status', width: 100 },
    { title: 'Actions', dataIndex: 'actions' },
  ];

  const {
    data: listControllerData,
    loading: listControllerLoading,
    error: listControllerError,
    listController,
  } = useListControllerApi<ListControllerResponse>();

  useEffect(() => {
    if (listControllerData) {
      setDataSource(listControllerData.data.map((item) => ({
        device_id: item.device_id || '-',
        store_name: item.store_name || '-',
        name: item.name || '-',
        total_relays: item.total_relays,
        status: <DynamicTag value={item.status} />,
        actions: (
          <Flex gap={theme.custom.spacing.medium}>
            <Button
              type="link"
              onClick={() => {
                navigate(`/controllers/${item.id}/detail`);
              }}
            >
              {t('common.detail')}
            </Button>
            <Button
              type="link"
              onClick={() => {
                navigate(`/controllers/${item.id}/edit`);
              }}
            >
              {t('common.edit')}
            </Button>
          </Flex>
        ),
      })));
    }
  }, [listControllerData]);

  useEffect(() => {
    if (listControllerError) {
      api.error({
        message: t('controller.listControllerError'),
      });
    }
  }, [listControllerError]);

  useEffect(() => {
    listController({ page, page_size: pageSize });
  }, [page, pageSize]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical style={{ height: '100%' }}>
        <Typography.Title level={2}>Controller List</Typography.Title>

        <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
          <LeftRightSection
            left={null}
            right={(<>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/controllers/abandoned')}>
                {t('controller.registerAbandoned')}
              </Button>
            </>)}
          />

          {listControllerLoading && <Skeleton active />}

          <Flex vertical gap={theme.custom.spacing.large}>

            <Table
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={{
                pageSize,
                current: page,
                total: listControllerData?.total,
                onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                },
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </PortalLayout>
  );
};
