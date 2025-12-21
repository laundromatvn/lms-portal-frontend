import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  List,
  Typography,
  Button,
  notification,
} from 'antd';

import { Rocket2 } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { Firmware } from '@shared/types/Firmware';

import {
  useListProvisioningControllerApi,
  type ListProvisioningControllerResponse,
} from '@shared/hooks/firmware/useListProvisioningControllerApi';
import {
  useCancelUpdateFirmwareApi,
} from '@shared/hooks/firmware/useCancelUpdateFirmwareApi';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { FlashControllersDrawer } from './components/FlashControllersDrawer';

const AUTO_REFRESH_INTERVAL_MS = 5_000;

interface Props {
  firmware: Firmware | null;
}

export const MobileView: React.FC<Props> = ({ firmware }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();

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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const autoRefresh = true;

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
          size="large"
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

      <List
        dataSource={listProvisioningControllerData?.data || []}
        style={{ width: '100%' }}
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
        renderItem={(item) => (
          <List.Item
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: theme.custom.spacing.small,
              padding: theme.custom.spacing.small,
              marginBottom: theme.custom.spacing.small,
              backgroundColor: theme.custom.colors.background.light,
              borderRadius: theme.custom.radius.medium,
              border: `1px solid ${theme.custom.colors.neutral[200]}`,
            }}
          >
            <Flex
              vertical
              gap={theme.custom.spacing.small}
              style={{ width: '100%' }}
            >
              <Flex justify="space-between" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
                <Flex gap={theme.custom.spacing.xsmall}>
                  <Typography.Text>{item.name}</Typography.Text>
                  <Typography.Text>·</Typography.Text>
                  <DynamicTag value={item.status} type="text" />
                </Flex>

                {item.deployment_status && (
                  <DynamicTag value={item.deployment_status} type="text" />
                )}
              </Flex>

              <Flex vertical style={{ width: '100%' }}>
                <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
                  {t('common.deviceId')}: {item.device_id ? item.device_id : '-'}
                </Typography.Text>

                <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
                  {t('common.storeName')}: {item.store_name ? item.store_name : '-'}
                </Typography.Text>
              </Flex>
            </Flex>
          </List.Item>
        )}
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
