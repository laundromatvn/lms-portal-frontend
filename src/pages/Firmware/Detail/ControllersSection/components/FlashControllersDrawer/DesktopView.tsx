import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Drawer,
  Flex,
  Popconfirm,
  Table,
  Typography,
  notification,
} from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';

import { Rocket2 } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import type { Firmware } from '@shared/types/Firmware';
import type { Controller } from '@shared/types/Controller';

import {
  useListControllerApi,
  type ListControllerResponse,
} from '@shared/hooks/useListControllerApi';
import {
  useFlashFirmwareApi,
  type FlashFirmwareResponse,
} from '@shared/hooks/firmware/useFlashFirmwareApi';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  firmware: Firmware | null;
  open: boolean;
  onClose: () => void;
}

export const DesktopView: React.FC<Props> = ({
  firmware,
  open,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [api, contextHolder] = notification.useNotification();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const {
    listController,
    data: listControllerData,
    loading: listControllerLoading,
  } = useListControllerApi<ListControllerResponse>();
  const {
    flashFirmware,
    error: flashFirmwareError,
    data: flashFirmwareData,
    loading: flashFirmwareLoading,
  } = useFlashFirmwareApi<FlashFirmwareResponse>();

  const handleListController = () => {
    listController({ page, page_size: pageSize });
  }

  const handleFlashFirmware = () => {
    if (!firmware) return;

    flashFirmware(
      firmware.id,
      {
        all_controllers: false,
        controller_ids: selectedRowKeys as string[],
      });
  }

  const handleFlashAllControllers = () => {
    if (!firmware) return;

    flashFirmware(firmware.id, {
      all_controllers: true,
      controller_ids: [],
    });
  }

  useEffect(() => {
    if (open) {
      handleListController();
    }
  }, [open, page, pageSize]);

  useEffect(() => {
    if (!open) {
      setSelectedRowKeys([]);
    }
  }, [open]);

  useEffect(() => {
    if (flashFirmwareData) {
      api.success({
        message: t('messages.flashFirmwareSuccess'),
      });
      onClose();
    }
  }, [flashFirmwareData]);

  useEffect(() => {
    if (flashFirmwareError) {
      api.error({
        message: t('messages.flashFirmwareError'),
      });
    }
  }, [flashFirmwareError]);

  const rowSelection: TableRowSelection<Controller> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    onSelectAll: (selected: boolean, selectedRows: Controller[], changeRows: Controller[]) => {
      if (selected) {
        const allKeys = (listControllerData?.data || []).map((row) => row.id);
        setSelectedRowKeys(allKeys);
      } else {
        setSelectedRowKeys([]);
      }
    },
  };

  const columns = [
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
      width: 128,
      render: (text: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/controllers/${record.id}/detail`)}>
          {text || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 128,
      render: (text: string) => <DynamicTag value={text} type="text" />,
    },
  ];

  return (
    <Drawer
      title={t('common.flashNewFirmware')}
      placement="right"
      onClose={onClose}
      open={open}
      width={isMobile ? '100%' : 720}
      styles={{
        body: {
          padding: theme.custom.spacing.medium,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {contextHolder}

      <BaseDetailSection
        title={t('common.flashNewFirmware')}
        onRefresh={handleListController}
      >
        {contextHolder}

        <Flex justify="end" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Button
            icon={<Rocket2 />}
            onClick={handleFlashFirmware}
            loading={flashFirmwareLoading}
            disabled={selectedRowKeys.length === 0}
            style={{
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          >
            {t('common.flash')}
          </Button>


          <Popconfirm
            title={t('common.flashAllControllers')}
            onConfirm={handleFlashAllControllers}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
            placement="bottom"
          >
            <Button
              style={{
                backgroundColor: theme.custom.colors.background.light,
                color: theme.custom.colors.neutral.default,
              }}
            >
              {t('common.flashAllControllers')}
            </Button>
          </Popconfirm>
        </Flex>

        <Table
          dataSource={listControllerData?.data || []}
          columns={columns}
          rowSelection={rowSelection}
          rowKey="id"
          style={{ width: '100%' }}
          loading={listControllerLoading}
          scroll={isMobile ? { x: 'max-content' } : undefined}
          pagination={{
            pageSize: pageSize,
            current: page,
            total: listControllerData?.total || 0,
            style: { color: theme.custom.colors.text.tertiary },
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </BaseDetailSection>
    </Drawer >
  );
};

