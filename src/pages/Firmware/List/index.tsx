import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, notification } from 'antd';

import { AddCircle, Refresh } from '@solar-icons/react';

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
  type DeprecateFirmwareResponse,
} from '@shared/hooks/firmware/useDeprecateFirmwareApi';
import {
  useReleaseFirmwareApi,
  type ReleaseFirmwareResponse,
} from '@shared/hooks/firmware/useReleaseFirmwareApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { Box } from '@shared/components/Box';

import { FirmwareListTable } from './Table';

export const FirmwareListPage: React.FC = () => {
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
        message: t('messages.deleteFirmwareError'),
      });
    }
  }, [deleteFirmwareError]);

  useEffect(() => {
    if (deleteFirmwareData) {
      api.success({
        message: t('messages.deleteFirmwareSuccess'),
      });
    }

    handleListFirmware();
  }, [deleteFirmwareData]);

  useEffect(() => {
    if (deprecateFirmwareData) {
      api.success({
        message: t('messages.deprecateFirmwareSuccess'),
      });
    }

    handleListFirmware();
  }, [deprecateFirmwareData]);

  useEffect(() => {
    if (releaseFirmwareData) {
      api.success({
        message: t('messages.releaseFirmwareSuccess'),
      });
    }

    handleListFirmware();
  }, [releaseFirmwareData]);

  useEffect(() => {
    if (deprecateFirmwareError) {
      api.error({
        message: t('messages.deprecateFirmwareError'),
      });
    }
  }, [deprecateFirmwareError]);

  useEffect(() => {
    if (releaseFirmwareError) {
      api.error({
        message: t('messages.releaseFirmwareError'),
      });
    }
  }, [releaseFirmwareError]);

  return (
    <PortalLayout title={t('common.firmware')} onBack={() => navigate(-1)}>
      {contextHolder}

      <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        <LeftRightSection
          left={null}
          right={(
            <Flex justify="end" gap={theme.custom.spacing.medium}>
              <Button type="text" icon={<Refresh size={18} />} onClick={handleListFirmware} loading={listFirmwareLoading} />
              <Button
                type="primary"
                icon={<AddCircle color={theme.custom.colors.text.inverted} />}
                onClick={() => navigate('/firmware/add')}
              >
                {t('common.addNewVersion')}
              </Button>
            </Flex>
          )}
        />

        <FirmwareListTable
          data={listFirmwareData}
          loading={listFirmwareLoading || deleteFirmwareLoading || releaseFirmwareLoading || deprecateFirmwareLoading}
          onFiltersChange={setFilters}
          onDeleteFirmware={(firmwareId) => deleteFirmware(firmwareId)}
          onReleaseFirmware={(firmwareId) => releaseFirmware(firmwareId)}
          onDeprecateFirmware={(firmwareId) => deprecateFirmware(firmwareId)}
        />
      </Box>
    </PortalLayout >
  );
};
