import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Flex,
  Table,
  Typography,
  Button,
} from 'antd';

import {
  Rocket2,
  Refresh,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { Firmware } from '@shared/types/Firmware';

import {
  useListProvisionedControllerApi,
  type ListProvisionedControllerResponse,
} from '@shared/hooks/firmware/useListProvisionedControllerApi';

import { LeftRightSection } from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { FlashControllersModalContent } from './FlashControllersModalContent';

interface Props {
  firmware: Firmware | null;
}

export const ControllerListTableView: React.FC<Props> = ({ firmware }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      title: t('common.status'),
      dataIndex: 'status',
      width: 128,
      render: (text: string) => <DynamicTag value={text} />,
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const {
    listProvisionedController,
    data: listProvisionedControllerData,
    loading: listProvisionedControllerLoading,
  } = useListProvisionedControllerApi<ListProvisionedControllerResponse>();

  const handleListProvisionedController = () => {
    if (!firmware) return;

    listProvisionedController(firmware.id, { page, page_size: pageSize });
  }

  useEffect(() => {
    handleListProvisionedController();
  }, [firmware, page, pageSize]);

  return (
    <Flex
      vertical
      gap={theme.custom.spacing.medium}
      style={{ width: '100%' }}
    >
      <LeftRightSection
        left={null}
        right={(
          <Flex gap={theme.custom.spacing.medium}>
            <Button
              type="text"
              icon={<Refresh size={18} />}
              onClick={handleListProvisionedController}
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

      <Table
        dataSource={listProvisionedControllerData?.data || []}
        columns={columns}
        style={{ width: '100%' }}
        loading={listProvisionedControllerLoading}
        pagination={{
          pageSize: pageSize,
          current: page,
          total: listProvisionedControllerData?.total || 0,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
      />

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
