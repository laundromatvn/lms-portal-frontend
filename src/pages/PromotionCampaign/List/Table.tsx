import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Table, Dropdown, Typography, notification, Flex } from 'antd';
import type { MenuProps } from 'antd';

import { AddCircle, MenuDots, Refresh, TrashBinTrash } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';

import { tenantStorage } from '@core/storage/tenantStorage';

import {
  useListPromotionCampaignApi,
  type ListPromotionCampaignResponse,
} from '@shared/hooks/promotion/useListPromotionCampaignApi';
import { useDeletePromotionCampaignApi } from '@shared/hooks/useDeletePromotionCampaignApi';

import { Box } from '@shared/components/Box';
import type { ColumnsType } from 'antd/es/table';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatDateTime } from '@shared/utils/date';
import LeftRightSection from '@shared/components/LeftRightSection';

export const PromotionCampaignListTable: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const tenant = tenantStorage.load();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc' | undefined>(undefined);

  const {
    data: listPromotionCampaignData,
    loading: listPromotionCampaignLoading,
    listPromotionCampaign,
  } = useListPromotionCampaignApi<ListPromotionCampaignResponse>();
  const {
    deletePromotionCampaign,
    data: deletePromotionCampaignData,
    error: deletePromotionCampaignError,
    loading: deletePromotionCampaignLoading,
  } = useDeletePromotionCampaignApi<void>();

  const handleListPromotionCampaign = () => {
    listPromotionCampaign({
      tenant_id: tenant?.id,
      page,
      page_size: pageSize,
      order_by: orderBy,
      order_direction: orderDirection,
    });
  }

  const columns: ColumnsType<PromotionCampaign> = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      width: 256,
      sorter: true,
      sortOrder: orderBy === 'name' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_, record) => <Typography.Link onClick={() => navigate(`/promotion-campaigns/${record.id}/detail`)}>{record.name}</Typography.Link>,
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
      key: 'description',
      width: 256,
      render: (_, record) => (
        <div
          style={{ 
            width: '100%',
            textAlign: 'left',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            lineHeight: '1.5',
          }}
        >
          {record.description || '-'}
        </div>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'status' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (value) => <DynamicTag value={value} />,
    },
    {
      title: t('common.startTime'),
      dataIndex: 'start_time',
      key: 'start_time',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'start_time' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (value) => formatDateTime(value),
    },
    {
      title: t('common.endTime'),
      dataIndex: 'end_time',
      key: 'end_time',
      width: 128,
      sorter: true,
      sortOrder: orderBy === 'end_time' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (value) => value ? formatDateTime(value) : '-',
    },
    {
      title: t('common.actions'),
      dataIndex: 'actions',
      key: 'actions',
      width: 128,
      render: (_value, record) => {
        const items: MenuProps['items'] = [
          {
            key: 'delete',
            label: t('common.delete'),
            onClick: () => deletePromotionCampaign(record.id),
            icon: <TrashBinTrash weight="Outline" size={18} />,
            style: {
              color: theme.custom.colors.danger.default,
            },
          }
        ];

        return (
          <Dropdown
            menu={{ items }}
            trigger={['click']}
          >
            <Button
              type="link"
              icon={<MenuDots weight="Bold" />}
            />
          </Dropdown>
        );
      },
    },
  ];

  useEffect(() => {
    handleListPromotionCampaign();
  }, [page, pageSize, orderBy, orderDirection]);

  useEffect(() => {
    if (!deletePromotionCampaignData) return;

    api.success({
      message: t('messages.deletePromotionCampaignSuccess'),
    });
    handleListPromotionCampaign();
  }, [deletePromotionCampaignData]);

  useEffect(() => {
    if (deletePromotionCampaignError) {
      api.error({
        message: t('messages.deletePromotionCampaignError'),
      });
    }
  }, [deletePromotionCampaignError]);

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      {contextHolder}

      <LeftRightSection
        left={null}
        right={(
          <Flex gap={theme.custom.spacing.small}>
            <Button
              type="text"
              icon={<Refresh color={theme.custom.colors.text.inverted} />}
              onClick={() => handleListPromotionCampaign()}
              loading={listPromotionCampaignLoading}
            />

            <Button
              type="primary"
              icon={<AddCircle color={theme.custom.colors.text.inverted} />}
              onClick={() => navigate('/promotion-campaigns/add')}
            >
              {t('common.addPromotionCampaign')}
            </Button>
          </Flex>
        )}
      />

      <Table
        bordered
        dataSource={listPromotionCampaignData?.data || []}
        columns={columns}
        loading={listPromotionCampaignLoading}
        style={{ width: '100%' }}
        pagination={{
          pageSize: 10,
          current: listPromotionCampaignData?.page,
          total: listPromotionCampaignData?.total,
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
            // Clear sorting when clicking the same column again
            setOrderBy(undefined);
            setOrderDirection(undefined);
          }
          
          setPage(pagination.current || 1);
          setPageSize(pagination.pageSize || 10);
        }}
      />
    </Box>
  );
};
