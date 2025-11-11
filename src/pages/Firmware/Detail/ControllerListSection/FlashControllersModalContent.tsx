import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Flex,
  Table,
  Typography,
  notification,
} from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';

import {
  Refresh,
  Rocket2,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

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

import { BaseModal } from '@shared/components/BaseModal';
import { LeftRightSection } from '@shared/components/LeftRightSection';
import { Box } from '@shared/components/Box';

interface Props {
  firmware: Firmware | null;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FlashControllersModalContent: React.FC<Props> = ({
  firmware,
  isModalOpen,
  setIsModalOpen,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

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
    handleListController();
  }, [page, pageSize]);

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedRowKeys([]);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (flashFirmwareData) {
      api.success({
        message: t('messages.flashFirmwareSuccess'),
      });
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
    { title: t('common.deviceId'), dataIndex: 'device_id', width: 128 },
    { title: t('common.status'), dataIndex: 'status', width: 128 },
    { title: t('common.controllerName'), dataIndex: 'name', width: 256 },
    { title: t('common.totalRelays'), dataIndex: 'total_relays', width: 48 },
  ];

  return (
    <BaseModal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      closable
      title={t('common.flashNewFirmware')}
    >
      {contextHolder}

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
        }}
      >
        <Typography.Text strong>{t('common.flashNewFirmware')}</Typography.Text>

        <Box
          vertical
          gap={theme.custom.spacing.medium}
          style={{ width: '100%', height: '100%' }}
        >
          <LeftRightSection
            left={null}
            right={(
              <Flex gap={theme.custom.spacing.medium}>
                <Button
                  type="text"
                  icon={<Refresh size={18} />}
                  onClick={handleListController}
                />

                <Button
                  type="primary"
                  icon={<Rocket2 />}
                  onClick={handleFlashFirmware}
                  loading={flashFirmwareLoading}
                  disabled={selectedRowKeys.length === 0}
                >
                  {t('common.flash')}
                </Button>

                <Button
                  type="primary"
                  icon={<Rocket2 />}
                  onClick={handleFlashAllControllers}
                  loading={flashFirmwareLoading}
                >
                  {t('common.flashAllControllers')}
                </Button>
              </Flex>
            )}
          />

          <Table
            dataSource={listControllerData?.data || []}
            columns={columns}
            rowSelection={rowSelection}
            rowKey="id"
            style={{ width: '100%' }}
            loading={listControllerLoading}
            pagination={{
              pageSize: pageSize,
              current: page,
              total: listControllerData?.total || 0,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        </Box>
      </Flex>
    </BaseModal>
  );
};