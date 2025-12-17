import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  Table,
  notification,
} from 'antd';

import {
  Shop2,
  Play,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListAbandondedControllerApi,
  type ListAbandondedControllerResponse,
} from '@shared/hooks/useListAbandondedControllerApi';
import {
  useVerifyAbandonedControllerApi,
} from '@shared/hooks/useVerifyAbandonedControllerApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { DynamicTag } from '@shared/components/DynamicTag';
import { AssignToStoreDrawer } from './AssignToStoreDrawer';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';

const AUTO_REFRESH_INTERVAL_MS = 2000;

export const TableView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  const columns = [
    { title: t('common.deviceId'), dataIndex: 'device_id', width: 128 },
    {
      title: t('common.status'), dataIndex: 'status',
      render: (_: string, record: any) => <DynamicTag value={record.status} />,
    },
    {
      title: t('common.actions'), dataIndex: 'actions', width: 256,
      render: (_: string, record: any) => (
        <Flex gap={theme.custom.spacing.medium}>
          <Button
            onClick={() => {
              setIsDrawerOpen(true);
              setDeviceId(record.device_id);
            }}
            icon={<Shop2 />}
          />
          <Button
            onClick={() => verifyAbandonedController(record.device_id)}
            loading={verifyAbandonedControllerLoading}
            icon={<Play />}
          />
        </Flex>
      )
    },
  ];

  const {
    data: listAbandondedControllerData,
    loading: listAbandondedControllerLoading,
    error: listAbandondedControllerError,
    listAbandondedController,
  } = useListAbandondedControllerApi<ListAbandondedControllerResponse>();
  const {
    verifyAbandonedController,
    loading: verifyAbandonedControllerLoading,
    data: verifyAbandonedControllerData,
    error: verifyAbandonedControllerError,
  } = useVerifyAbandonedControllerApi();

  useEffect(() => {
    if (listAbandondedControllerError) {
      api.error({
        message: t('controller.listAbandondedControllerError'),
      });
    }
  }, [listAbandondedControllerError]);

  useEffect(() => {
    if (verifyAbandonedControllerData) {
      api.success({
        message: t('controller.sendTestSuccess'),
      });
    }
  }, [verifyAbandonedControllerData]);

  useEffect(() => {
    if (verifyAbandonedControllerError) {
      api.error({
        message: t('controller.verifyAbandonedControllerError'),
      });
    }
  }, [verifyAbandonedControllerError]);

  useEffect(() => {
    listAbandondedController({ page: 1, page_size: 10 });
  }, []);

  useEffect(() => {
    if (!isDrawerOpen) {
      listAbandondedController({ page: 1, page_size: 10 });
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDrawerOpen && !listAbandondedControllerLoading) {
        listAbandondedController({ page: 1, page_size: 10 });
      }
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isDrawerOpen, listAbandondedControllerLoading, listAbandondedController]);

  return (
    <PortalLayoutV2
      title={t('controller.addController')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <BaseDetailSection
        title={t('controller.abandonedController')}
        onRefresh={() => listAbandondedController({ page: 1, page_size: 10 })}
      >
        <Table
          dataSource={listAbandondedControllerData?.data.map((deviceId) => ({
            device_id: deviceId,
            status: 'abandoned',
          }))}
          columns={columns}
          style={{ width: '100%' }}
        />
      </BaseDetailSection>

      <AssignToStoreDrawer
        deviceId={deviceId}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        onSave={() => listAbandondedController({ page: 1, page_size: 10 })}
      />
    </PortalLayoutV2>
  );
};
