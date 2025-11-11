import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Dropdown,
  Flex,
  notification,
  Table,
  Typography,
} from 'antd';

import {
  MenuDots,
  TrashBinTrash,
  Rocket2,
  ArchiveDown,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  type ListFirmwareRequest,
  type ListFirmwareResponse,
} from '@shared/hooks/firmware/useListFirmwareApi';

import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  data: ListFirmwareResponse | null;
  loading: boolean;
  onFiltersChange: (filters: ListFirmwareRequest) => void;
  onDeleteFirmware: (firmwareId: string) => void;
  onReleaseFirmware: (firmwareId: string) => void;
  onDeprecateFirmware: (firmwareId: string) => void;
}

export const FirmwareListTable: React.FC<Props> = ({
  data,
  loading,
  onFiltersChange,
  onDeleteFirmware,
  onReleaseFirmware,
  onDeprecateFirmware,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
  const [orderDirection, setOrderDirection] = useState<string | undefined>(undefined);

  const columns = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      width: 128,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/firmware/${record.id}/detail`)}>
          {record.name}
        </Typography.Link>
      ),
      sorter: true,
      sortOrder: orderBy === 'name' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.version'),
      dataIndex: 'version',
      key: 'version',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'version' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'status' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_: string, record: any) => <DynamicTag value={record.status} />,
    },
    {
      title: t('common.actions'),
      dataIndex: 'actions',
      key: 'actions',
      width: 128,
      render: (_: string, record: any) => {
        return (
          <Flex gap={theme.custom.spacing.medium}>
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'release',
                    label: t('common.release'),
                    onClick: () => onReleaseFirmware(record.id),
                    icon: <Rocket2 weight="Outline" color={theme.custom.colors.success.default} />,
                    style: {
                      color: theme.custom.colors.success.default,
                    },
                  },
                  {
                    key: 'deprecate',
                    label: t('common.deprecate'),
                    onClick: () => onDeprecateFirmware(record.id),
                    icon: <ArchiveDown weight="Outline" color={theme.custom.colors.warning.default} />,
                    style: {
                      color: theme.custom.colors.warning.default,
                    },
                  },
                  {
                    key: 'delete',
                    label: t('common.delete'),
                    onClick: () => onDeleteFirmware(record.id),
                    icon: <TrashBinTrash size={18} />,
                    style: {
                      color: theme.custom.colors.danger.default,
                    },
                  },
                ],
              }}
            >
              <Button type="link" icon={<MenuDots size={18} />} />
            </Dropdown>
          </Flex>
        );
      }
    },
  ];

  useEffect(() => {
    onFiltersChange({
      page: data?.page || 1,
      page_size: data?.page_size || 10,
      order_by: orderBy,
      order_direction: orderDirection as 'asc' | 'desc',
    });
  }, [orderBy, orderDirection]);

  return (
    <>
      {contextHolder}
      <Table
        columns={columns as any}
        dataSource={data?.data || []}
        style={{ width: '100%' }}
        loading={loading}
        pagination={{
          pageSize: pageSize,
          current: page,
          total: data?.total || 0,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        onChange={(pagination, _filters, sorter) => {
          if (sorter && 'field' in sorter && sorter.field) {
            setOrderBy(sorter.field as string);
            setOrderDirection(sorter.order === 'ascend' ? 'asc' : 'desc');
          } else if (sorter && 'order' in sorter && !sorter.order) {
            setOrderBy(undefined);
            setOrderDirection(undefined);
          }

          setPage(pagination.current || 1);
          setPageSize(pagination.pageSize || 10);
        }}
      />
    </>
  );
};
