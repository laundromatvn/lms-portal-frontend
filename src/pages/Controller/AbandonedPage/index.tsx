import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, Skeleton, Table, Typography, notification } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { useListAbandondedControllerApi, type ListAbandondedControllerResponse } from '@shared/hooks/useListAbandondedControllerApi';
import { useVerifyAbandonedControllerApi } from '@shared/hooks/useVerifyAbandonedControllerApi';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { BaseModal } from '@shared/components/BaseModal';
import { AssignToStoreModalContent } from './AssignToStoreModalContent';

export const ControllerAbandonedPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [api, contextHolder] = notification.useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [controllerId, setControllerId] = useState('');
  const [dataSource, setDataSource] = useState<any[]>([]);

  const columns = [
    { title: 'Controller ID', dataIndex: 'id' },
    { title: 'Status', dataIndex: 'status' },
    { title: 'Actions', dataIndex: 'actions' },
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
            >
              {t('controller.assign')}
            </Button>
            <Button
              type="default"
              onClick={() => verifyAbandonedController(item)}
              loading={verifyAbandonedControllerLoading}
            >
              {t('controller.test')}
            </Button>
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

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('controller.abandonedController')}</Typography.Title>

        <LeftRightSection
          left={null}
          right={(<>
            <Button
              type="primary"
              size="large"
              onClick={() => listAbandondedController({ page: 1, page_size: 10 })}
              loading={listAbandondedControllerLoading}
            >
              {t('common.reload')}
            </Button>
          </>)}
        />

        {listAbandondedControllerLoading
          ? (
            <Skeleton active />
          ) : (
            <Flex vertical gap={theme.custom.spacing.large}>
              <Table
                dataSource={dataSource}
                columns={columns}
              />
            </Flex>
          )}
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
