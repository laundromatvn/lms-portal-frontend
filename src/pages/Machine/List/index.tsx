import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography, Table, Skeleton, notification } from 'antd';

import { CheckCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListMachineApi,
  type ListMachineResponse,
} from '@shared/hooks/useListMachineApi';
import {
  useActivateMachineApi,
  type ActivateMachineResponse,
} from '@shared/hooks/useActivateMachineApi';

import { formatCurrencyCompact } from '@shared/utils/currency';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Box } from '@shared/components/Box';

export const MachineListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [tableData, setTableData] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { title: t('common.storeName'), dataIndex: 'store_name', width: 256 },
    { title: t('common.deviceId'), dataIndex: 'controller_device_id', width: 128 },
    { title: t('common.relayNo'), dataIndex: 'relay_no', width: 48 },
    { title: t('common.machineName'), dataIndex: 'name', width: 256 },
    { title: t('common.machineType'), dataIndex: 'machine_type', width: 128 },
    { title: t('common.basePrice'), dataIndex: 'base_price', width: 128 },
    { title: t('common.status'), dataIndex: 'status', width: 128 },
    { title: t('common.actions'), dataIndex: 'actions' },
  ];

  const {
    data: listMachineData,
    loading: listMachineLoading,
    error: listMachineError,
    listMachine,
  } = useListMachineApi<ListMachineResponse>();
  const {
    activateMachine,
    data: activateMachineData,
    loading: activateMachineLoading,
    error: activateMachineError,
  } = useActivateMachineApi<ActivateMachineResponse>();

  useEffect(() => {
    if (listMachineData) {
      setTableData(listMachineData?.data.map((item) => ({
        id: item.id,
        store_name: <Typography.Link onClick={() => navigate(`/stores/${item.store_id}/detail`)}>{item.store_name || '-'}</Typography.Link>,
        controller_id: <Typography.Link onClick={() => navigate(`/controllers/${item.controller_id}/detail`)}>{item.controller_id || '-'}</Typography.Link>,
        controller_device_id: <Typography.Link onClick={() => navigate(`/controllers/${item.controller_id}/detail`)}>{item.controller_device_id || '-'}</Typography.Link>,
        relay_no: item.relay_no,
        name: <Typography.Link onClick={() => navigate(`/machines/${item.id}/detail`)}>{item.name || '-'}</Typography.Link>,
        machine_type: item.machine_type,
        base_price: formatCurrencyCompact(item.base_price),
        status: <DynamicTag value={item.status} />,
        actions: (
          <Flex gap={theme.custom.spacing.medium}>
            <Button
              type="link"
              onClick={() => {
                activateMachine(item.id);
              }}
              loading={activateMachineLoading}
              icon={<CheckCircle weight="Outline" />}
              style={{
                color: theme.custom.colors.success.default,
              }}
            >
              {t('common.activateMachine')}
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

  useEffect(() => {
    if (activateMachineError) {
      api.error({
        message: t('messages.activateMachineError'),
      });
    }
  }, [activateMachineError]);

  useEffect(() => {
    if (activateMachineData) {
      api.success({
        message: t('messages.activateMachineSuccess'),
      });

      listMachine({ page, page_size: pageSize });
    }
  }, [activateMachineData]);

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

          {!listMachineLoading && (
            <Box vertical gap={theme.custom.spacing.large} style={{ width: '100%' }}>
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
                style={{ width: '100%' }}
                scroll={{ x: 'max-content' }}
              />
            </Box>
          )}
        </Flex>
      </Flex>
    </PortalLayout>
  );
};
