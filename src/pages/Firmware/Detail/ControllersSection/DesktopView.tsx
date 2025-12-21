import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Flex,
  Table,
  Typography,
  Button,
  Dropdown,
  notification,
} from 'antd';

import { CloseOutlined } from '@ant-design/icons';

import {
  Rocket2,
  MenuDots,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListProvisioningControllerApi,
  type ListProvisioningControllerResponse,
} from '@shared/hooks/firmware/useListProvisioningControllerApi';
import {
  useCancelUpdateFirmwareApi,
} from '@shared/hooks/firmware/useCancelUpdateFirmwareApi';

import type { Firmware } from '@shared/types/Firmware';
import { FirmwareDeploymentStatusEnum } from '@shared/enums/FirmwareDeploymentStatusEnum';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { FlashControllersDrawer } from './components/FlashControllersDrawer';

const AUTO_REFRESH_INTERVAL_MS = 5_000;

interface Props {
  firmware: Firmware | null;
}

export const DesktopView: React.FC<Props> = ({ firmware }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const autoRefresh = true;

  const {
    listProvisioningController,
    data: listProvisioningControllerData,
  } = useListProvisioningControllerApi<ListProvisioningControllerResponse>();
  const {
    cancelUpdateFirmware,
    data: cancelUpdateFirmwareData,
    error: cancelUpdateFirmwareError,
  } = useCancelUpdateFirmwareApi();

  const columns = [
    {
      title: t('common.tenantName'),
      dataIndex: 'tenant_name',
      width: 128,
    },
    {
      title: t('common.storeName'),
      dataIndex: 'store_name',
      width: 128,
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
      title: t('common.controllerStatus'),
      dataIndex: 'status',
      width: 128,
      render: (text: string) => <DynamicTag value={text} type="text" />,
    },
    {
      title: t('common.deploymentStatus'),
      dataIndex: 'deployment_status',
      width: 128,
      render: (text: string) => <DynamicTag value={text} type="text" />,
    },
    {
      title: t('common.actions'),
      dataIndex: 'actions',
      width: 128,
      render: (_: string, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'cancel',
                label: t('common.cancel'),
                onClick: () => cancelUpdateFirmware(record.deployment_id),
                icon: <CloseOutlined />,
                style: { color: theme.custom.colors.danger.default },
                disabled: ![FirmwareDeploymentStatusEnum.NEW, FirmwareDeploymentStatusEnum.REBOOTING].includes(record.deployment_status as any),
              },
            ],
          }}
        >
          <Button
            type="text"
            icon={<MenuDots weight="Bold" />}
          />
        </Dropdown>
      ),
    },
  ];

  const handleListProvisioningController = () => {
    if (!firmware) return;

    listProvisioningController(firmware.id, { page, page_size: pageSize });
  }

  useEffect(() => {
    handleListProvisioningController();
  }, [firmware, page, pageSize]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleListProvisioningController();
      }, AUTO_REFRESH_INTERVAL_MS);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    if (cancelUpdateFirmwareError) {
      api.error({
        message: t('common.cancelUpdateFirmwareError'),
        description: cancelUpdateFirmwareError.message,
      });
    }
  }, [cancelUpdateFirmwareError]);

  useEffect(() => {
    if (cancelUpdateFirmwareData) {
      api.success({
        message: t('common.cancelUpdateFirmwareSuccess'),
      });
      handleListProvisioningController();
    }
  }, [cancelUpdateFirmwareData]);

  return (
    <BaseDetailSection
      title={t('common.provisioningControllers')}
      onRefresh={handleListProvisioningController}
    >
      {contextHolder}

      <Flex
        justify="flex-end"
        align="center"
        gap={theme.custom.spacing.small}
        style={{ width: '100%' }}
      >
        <Button
          icon={<Rocket2 />}
          onClick={() => setIsDrawerOpen(true)}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        >
          {t('common.flashNewFirmware')}
        </Button>
      </Flex>

      <Table
        bordered
        dataSource={listProvisioningControllerData?.data || []}
        columns={columns}
        style={{ width: '100%', overflowX: 'auto' }}
        pagination={{
          pageSize: pageSize,
          current: page,
          total: listProvisioningControllerData?.total || 0,
          style: { color: theme.custom.colors.text.tertiary },
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        onRow={() => {
          return {
            style: {
              backgroundColor: theme.custom.colors.background.light,
            },
          };
        }}
      />

      {isDrawerOpen && (
        <FlashControllersDrawer
          firmware={firmware}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </BaseDetailSection>
  );
};
