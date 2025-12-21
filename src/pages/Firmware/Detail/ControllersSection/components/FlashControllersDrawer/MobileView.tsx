import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Drawer,
  Flex,
  Checkbox,
  Popconfirm,
  List,
  Typography,
  notification,
} from 'antd';

import { Rocket2, CheckCircle } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import type { Firmware } from '@shared/types/Firmware';

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
import { Box } from '@shared/components/Box';

interface Props {
  firmware: Firmware | null;
  open: boolean;
  onClose: () => void;
}

export const MobileView: React.FC<Props> = ({
  firmware,
  open,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [api, contextHolder] = notification.useNotification();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

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

  const handleCheckboxChange = (key: React.Key, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys([...selectedRowKeys, key]);
    } else {
      setSelectedRowKeys(selectedRowKeys.filter(itemKey => itemKey !== key));
    }
  };

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
      footer={
        <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
          <Button
            size="large"
            onClick={onClose}
            style={{
              width: '100%',
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<Rocket2 />}
            onClick={handleFlashFirmware}
            loading={flashFirmwareLoading}
            disabled={selectedRowKeys.length === 0}
            style={{ width: '100%' }}
          >
            {t('common.flash')}
          </Button>
        </Flex>
      }
    >
      {contextHolder}

      <BaseDetailSection
        title={t('common.flashNewFirmware')}
        onRefresh={handleListController}
      >
        {contextHolder}

        <Flex justify="end" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
          <Popconfirm
            title={t('common.flashAllControllers')}
            onConfirm={handleFlashAllControllers}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
            placement="bottom"
          >
            <Button
              size="large"
              style={{
                width: '100%',
                backgroundColor: theme.custom.colors.background.light,
                color: theme.custom.colors.neutral.default,
              }}
            >
              {t('common.flashAllControllers')}
            </Button>
          </Popconfirm>
        </Flex>

        <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
          {t('firmware.selected', { count: selectedRowKeys.length })}
        </Typography.Text>

        <List
          dataSource={listControllerData?.data || []}
          style={{ width: '100%' }}
          loading={listControllerLoading}
          rowKey="id"
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
          renderItem={(item) => {
            const isSelected = selectedRowKeys.includes(item.id);

            return (
              <List.Item
                onClick={() => handleCheckboxChange(item.id, !isSelected)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: theme.custom.spacing.small,
                  overflow: 'hidden',
                  width: '100%',
                  padding: theme.custom.spacing.small,
                  marginBottom: theme.custom.spacing.medium,
                  backgroundColor: isSelected ? theme.custom.colors.info.light : theme.custom.colors.background.light,
                  borderRadius: theme.custom.radius.medium,
                  border: `1px solid ${theme.custom.colors.neutral[200]}`,
                }}
              >
                <Flex justify="space-between" style={{ width: '100%' }}>
                  <Flex gap={theme.custom.spacing.xsmall}>
                    <Checkbox checked={isSelected} />
                    <Typography.Text ellipsis>{item.name}</Typography.Text>
                  </Flex>
                  <DynamicTag value={item.status} type="text" />
                </Flex>

                <Flex vertical gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: theme.custom.fontSize.xsmall }}
                  >
                    {t('common.deviceId')}: {item.device_id}
                  </Typography.Text>

                  <Typography.Text
                    type="secondary"
                    ellipsis
                    style={{ fontSize: theme.custom.fontSize.xsmall }}
                  >
                    {t('common.storeName')}: {item.store_name}
                  </Typography.Text>
                </Flex>
              </List.Item>
            )
          }}
        />
      </BaseDetailSection>
    </Drawer >
  );
};

