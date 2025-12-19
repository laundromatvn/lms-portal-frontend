import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListControllerApi,
  type ListControllerResponse,
} from '@shared/hooks/useListControllerApi';

import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import type { Controller } from '@shared/types/Controller';

interface Props {
  store: Store;
}

export const DesktopView: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  const columns: ColumnsType<Controller> = [
    {
      title: t('common.deviceId'),
      dataIndex: 'device_id',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'device_id' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/controllers/${record.id}/detail`)}>
          {record.device_id || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.controllerName'),
      dataIndex: 'name',
      width: 256,
      sorter: true,
      sortOrder: orderBy === 'name' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/controllers/${record.id}/detail`)}>
          {record.name || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'status' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => <DynamicTag value={record.status} type="text" />
    },
    {
      title: t('common.firmware'),
      dataIndex: 'firmware_name',
      width: 128,
      render: (_: string, record: any) => (
        <Typography.Link
          disabled={!record.firmware_id}
          onClick={() => navigate(`/firmware/${record.firmware_id}/detail`)}
        >
          {record.firmware_id ? `${record.firmware_name} (${record.firmware_version})` : t('common.unknown')}
        </Typography.Link>
      ),
    },
    {
      title: t('common.totalRelays'),
      dataIndex: 'total_relays',
      width: 48,
    },
  ];

  const {
    listController,
    data: listControllerData,
    loading: listControllerLoading,
  } = useListControllerApi<ListControllerResponse>();

  const handleListController = () => {
    listController({
      store_id: store.id,
      page,
      page_size: pageSize,
      order_by: orderBy,
      order_direction: orderDirection,
    });
  };

  useEffect(() => {
    handleListController();
  }, [page, pageSize]);

  return (
    <BaseDetailSection
      title={t('common.controllers')}
      onRefresh={handleListController}
    >
      <Table
        bordered
        dataSource={listControllerData?.data || []}
        columns={columns}
        loading={listControllerLoading}
        pagination={{
          pageSize,
          current: page,
          total: listControllerData?.total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        onChange={(pagination, _filters, sorter) => {
          if (sorter && !Array.isArray(sorter)) {
            const field = ('field' in sorter && sorter.field) || ('columnKey' in sorter && sorter.columnKey);
            if (field && sorter.order) {
              setOrderBy(field as string);
              setOrderDirection(sorter.order === 'ascend' ? 'asc' : 'desc');
            } else if (sorter.order === null || sorter.order === undefined) {
              setOrderBy('');
              setOrderDirection('asc');
            }
          }

          setPage(pagination.current || 1);
          setPageSize(pagination.pageSize || 10);
        }}
        onRow={() => {
          return {
            style: {
              backgroundColor: theme.custom.colors.background.light,
            },
          };
        }}
        style={{
          width: '100%',
          backgroundColor: theme.custom.colors.background.light,
          color: theme.custom.colors.neutral.default,
        }}
      />
    </BaseDetailSection>
  );
};
