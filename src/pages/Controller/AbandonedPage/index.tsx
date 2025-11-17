import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Switch, Table, Typography, notification } from 'antd';

import { ArrowLeft, PaperclipRounded, Play, Refresh } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { useListAbandondedControllerApi, type ListAbandondedControllerResponse } from '@shared/hooks/useListAbandondedControllerApi';
import { useVerifyAbandonedControllerApi } from '@shared/hooks/useVerifyAbandonedControllerApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { BaseModal } from '@shared/components/BaseModal';
import { AssignToStoreModalContent } from './AssignToStoreModalContent';
import { Box } from '@shared/components/Box';

const AUTO_REFRESH_INTERVAL_MS = 2000;
const AUTO_REFRESH_INTERVAL_SECONDS = AUTO_REFRESH_INTERVAL_MS / 1000;

export const ControllerAbandonedPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [controllerId, setControllerId] = useState('');
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const columns = [
    { title: t('common.deviceId'), dataIndex: 'id', width: 128 },
    { title: t('common.status'), dataIndex: 'status', },
    { title: t('common.actions'), dataIndex: 'actions', width: 256 },
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
    if (listAbandondedControllerData) {
      setDataSource(listAbandondedControllerData?.data.map((item) => ({
        id: item,
        status: <DynamicTag value="Abandoned" />,
        actions: (
          <Flex gap={theme.custom.spacing.medium}>
            <Button
              type="default"
              onClick={() => {
                setIsOpen(true);
                setControllerId(item);
              }}
              style={{ color: theme.custom.colors.info.default }}
              icon={<PaperclipRounded weight="Outline" />}
            />
            <Button
              type="default"
              onClick={() => verifyAbandonedController(item)}
              loading={verifyAbandonedControllerLoading}
              style={{ color: theme.custom.colors.success.default }}
              icon={<Play weight="Bold" />}
            />
          </Flex>
        ),
      })));
    }
  }, [listAbandondedControllerData]);

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
    if (!isOpen) {
      listAbandondedController({ page: 1, page_size: 10 });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (!isOpen && !listAbandondedControllerLoading) {
        listAbandondedController({ page: 1, page_size: 10 });
      }
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [autoRefresh, isOpen, listAbandondedControllerLoading, listAbandondedController]);

  return (
    <PortalLayout title={t('controller.abandonedController')} onBack={() => navigate(-1)}>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Box
          vertical
          gap={theme.custom.spacing.large}
          style={{ width: '100%' }}
        >
          <LeftRightSection
            left={
              <Flex gap={theme.custom.spacing.medium} align="center">
                <Switch
                  checked={autoRefresh}
                  onChange={setAutoRefresh}
                  size="small"
                />
                <Typography.Text type="secondary">
                  {autoRefresh
                    ? t('controller.autoRefreshEveryXSeconds', { seconds: AUTO_REFRESH_INTERVAL_SECONDS })
                    : t('controller.autoRefreshDisabled')
                  }
                </Typography.Text>
              </Flex>
            }
            right={(
              <Button
                type="default"
                onClick={() => listAbandondedController({ page: 1, page_size: 10 })}
                icon={<Refresh />}
              />
            )}
          />

          <Table
            dataSource={dataSource}
            columns={columns}
            style={{ width: '100%' }}
          />
        </Box>
      </Flex>

      <BaseModal
        closable={true}
        isModalOpen={isOpen}
        setIsModalOpen={setIsOpen}
      >
        <AssignToStoreModalContent controllerId={controllerId} setIsOpen={setIsOpen} />
      </BaseModal>
    </PortalLayout>
  );
};
