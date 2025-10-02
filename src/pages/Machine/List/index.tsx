import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography, Table, Skeleton, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { useListMachineApi, type ListMachineResponse } from '@shared/hooks/useListMachineApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';

export const MachineListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [tableData, setTableData] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { title: 'Store Name', dataIndex: 'store_name', width: 400 },
    { title: 'Machine ID', dataIndex: 'id', width: 200 },
    { title: 'Controller ID', dataIndex: 'controller_id', width: 200 },
    { title: 'Relay No', dataIndex: 'relay_no', width: 200 },
    { title: 'Name', dataIndex: 'name', width: 400 },
    { title: 'Machine Type', dataIndex: 'machine_type', width: 200 },
    { title: 'Base Price', dataIndex: 'base_price', width: 200 },
    { title: 'Status', dataIndex: 'status', width: 200 },
    { title: 'Actions', dataIndex: 'actions' },
  ];

  const {
    data: listMachineData,
    loading: listMachineLoading,
    error: listMachineError,
    listMachine,
  } = useListMachineApi<ListMachineResponse>();

  useEffect(() => {
    if (listMachineData) {
      setTableData(listMachineData?.data.map((item) => ({
        id: item.id,
        store_name: item.store_name || '-',
        controller_id: item.controller_id || '-',
        relay_no: item.relay_no,
        name: item.name || '-',
        machine_type: item.machine_type,
        base_price: item.base_price,
        status: <DynamicTag value={item.status} />,
        actions: (
          <Flex gap={theme.custom.spacing.medium}>
            <Button
              type="link"
              onClick={() => {
                navigate(`/machines/${item.id}`);
              }}
            >
              {t('common.detail')}
            </Button>
          </Flex>
        ),
      })));
    }
  }, [listMachineData]);

  useEffect(() => {
    if (listMachineError) {
      api.error({
        message: t('machine.listMachineError'),
      });
    }
  }, [listMachineError]);

  useEffect(() => {
    listMachine({ page, page_size: pageSize });
  }, [page, pageSize]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical style={{ height: '100%' }}>
        <Typography.Title level={2}>Machine List</Typography.Title>

        <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
          <LeftRightSection
            left={null}
            right={null}
          />

          {listMachineLoading && <Skeleton active />}

          <Flex vertical gap={theme.custom.spacing.large}>

            <Table
              bordered
              dataSource={tableData || []}
              columns={columns}
              pagination={{
                pageSize,
                current: page,
                total: listMachineData?.total,
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
