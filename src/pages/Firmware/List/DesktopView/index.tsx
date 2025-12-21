import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  notification,
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListFirmwareApi,
  type ListFirmwareRequest,
  type ListFirmwareResponse,
} from '@shared/hooks/firmware/useListFirmwareApi';
import {
  useDeleteFirmwareApi,
  type DeleteFirmwareResponse,
} from '@shared/hooks/firmware/useDeleteFirmwareApi';
import {
  useDeprecateFirmwareApi,
} from '@shared/hooks/firmware/useDeprecateFirmwareApi';
import {
  useReleaseFirmwareApi,
} from '@shared/hooks/firmware/useReleaseFirmwareApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { TableView } from './TableView';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [filters, setFilters] = useState<ListFirmwareRequest>({
    page: 1,
    page_size: 10,
  });

  const {
    data: listFirmwareData,
    loading: listFirmwareLoading,
    listFirmware,
  } = useListFirmwareApi<ListFirmwareResponse>();
  const {
    deleteFirmware,
    data: deleteFirmwareData,
    error: deleteFirmwareError,
    loading: deleteFirmwareLoading,
  } = useDeleteFirmwareApi<DeleteFirmwareResponse>();
  const {
    deprecateFirmware,
    data: deprecateFirmwareData,
    loading: deprecateFirmwareLoading,
    error: deprecateFirmwareError,
  } = useDeprecateFirmwareApi();
  const {
    releaseFirmware,
    data: releaseFirmwareData,
    loading: releaseFirmwareLoading,
    error: releaseFirmwareError,
  } = useReleaseFirmwareApi();

  const handleListFirmware = () => {
    listFirmware(filters);
  }

  useEffect(() => {
    handleListFirmware();
  }, [filters]);

  useEffect(() => {
    if (deleteFirmwareError) {
      api.error({
        message: t('firmware.deleteFirmwareError'),
      });
    }
  }, [deleteFirmwareError]);

  useEffect(() => {
    if (deleteFirmwareData) {
      api.success({
        message: t('firmware.deleteFirmwareSuccess'),
      });
    }

    handleListFirmware();
  }, [deleteFirmwareData]);

  useEffect(() => {
    if (deprecateFirmwareData) {
      api.success({
        message: t('firmware.deprecateFirmwareSuccess'),
      });
    }

    handleListFirmware();
  }, [deprecateFirmwareData]);

  useEffect(() => {
    if (releaseFirmwareData) {
      api.success({
        message: t('firmware.releaseFirmwareSuccess'),
      });
    }

    handleListFirmware();
  }, [releaseFirmwareData]);

  useEffect(() => {
    if (deprecateFirmwareError) {
      api.error({
        message: t('firmware.deprecateFirmwareError'),
      });
    }
  }, [deprecateFirmwareError]);

  useEffect(() => {
    if (releaseFirmwareError) {
      api.error({
        message: t('firmware.releaseFirmwareError'),
      });
    }
  }, [releaseFirmwareError]);

  return (
    <PortalLayoutV2
      title={t('navigation.firmware')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <BaseDetailSection>
        <Flex justify="end" align="center" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate('/firmware/add')}
            style={{
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          >
            {t('common.addNewVersion')}
          </Button>
        </Flex>

        <TableView
          data={listFirmwareData}
          loading={listFirmwareLoading || deleteFirmwareLoading || releaseFirmwareLoading || deprecateFirmwareLoading}
          onFiltersChange={setFilters}
          onDeleteFirmware={(firmwareId) => deleteFirmware(firmwareId)}
          onReleaseFirmware={(firmwareId) => releaseFirmware(firmwareId)}
          onDeprecateFirmware={(firmwareId) => deprecateFirmware(firmwareId)}
        />
      </BaseDetailSection>
    </PortalLayoutV2 >
  );
};
