import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Flex,
  Table,
  Typography,
  Button,
  Switch,
  Dropdown,
  notification,
} from 'antd';

import {
  Rocket2,
  Refresh,
  CloseCircle,
  MenuDots,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { Firmware } from '@shared/types/Firmware';

import {
  useListProvisioningControllerApi,
  type ListProvisioningControllerResponse,
} from '@shared/hooks/firmware/useListProvisioningControllerApi';
import {
  useCancelUpdateFirmwareApi,
  type CancelUpdateFirmwareResponse,
} from '@shared/hooks/firmware/useCancelUpdateFirmwareApi';

import { LeftRightSection } from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { FlashControllersModalContent } from './FlashControllersModalContent';
import { FirmwareDeploymentStatusEnum } from '@shared/enums/FirmwareDeploymentStatusEnum';

const AUTO_REFRESH_INTERVAL_MS = 2000;
const AUTO_REFRESH_INTERVAL_SECONDS = AUTO_REFRESH_INTERVAL_MS / 1000;

interface Props {
  firmware: Firmware | null;
}

export const ControllerListTableView: React.FC<Props> = ({ firmware }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

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
      render: (text: string) => <DynamicTag value={text} />,
    },
    {
      title: t('common.deploymentStatus'),
      dataIndex: 'deployment_status',
      width: 128,
      render: (text: string) => text ? <DynamicTag value={text} /> : '-',
    },
    {
      title: t('common.actions'),
      dataIndex: 'actions',
      width: 128,
      render: (_: string, record: any) => (
        <Flex gap={theme.custom.spacing.medium}>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'cancel',
                  label: t('common.cancel'),
                  onClick: () => cancelUpdateFirmware(record.deployment_id),
                  icon: <CloseCircle weight="BoldDuotone" size={18} color={theme.custom.colors.danger.default} />,
                  style: {
                    color: theme.custom.colors.danger.default,
                  },
                  disabled: ![FirmwareDeploymentStatusEnum.NEW, FirmwareDeploymentStatusEnum.REBOOTING].includes(record.deployment_status as any),
                },
              ],
            }}
          >
            <Button type="link" icon={<MenuDots size={18} />} />
          </Dropdown>
        </Flex>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [autoRefresh, setAutoRefresh] = useState(false);

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
    <Flex
      vertical
      gap={theme.custom.spacing.medium}
      style={{ width: '100%' }}
    >
      {contextHolder}

      <LeftRightSection
        left={(
          <Flex gap={theme.custom.spacing.medium} align="center">
            <Switch
              checked={autoRefresh}
              onChange={setAutoRefresh}
            />
            <Typography.Text type="secondary">
              {autoRefresh
                ? t('common.autoRefreshEveryXSeconds', { seconds: AUTO_REFRESH_INTERVAL_SECONDS })
                : t('common.autoRefreshDisabled')
              }
            </Typography.Text>
          </Flex>
        )}
        right={(
          <Flex gap={theme.custom.spacing.medium} align="center">
            <Button
              type="text"
              icon={<Refresh size={18} />}
              onClick={handleListProvisioningController}
            />

            <Button
              type="primary"
              icon={<Rocket2 />}
              style={{
                color: theme.custom.colors.text.inverted,
                backgroundColor: theme.custom.colors.success.default,
              }}
              onClick={() => setIsModalOpen(true)}
            >
              {t('common.flashNewFirmware')}
            </Button>
          </Flex>
        )}
      />

      <Flex style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <Table
          dataSource={listProvisioningControllerData?.data || []}
          columns={columns}
          style={{ width: '100%' }}
          pagination={{
            pageSize: pageSize,
            current: page,
            total: listProvisioningControllerData?.total || 0,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Flex>

      {isModalOpen && (
        <FlashControllersModalContent
          firmware={firmware}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </Flex>
  );
};
