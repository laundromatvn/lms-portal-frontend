import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import dayjs, { type Dayjs } from 'dayjs';

import { Button, Table, Dropdown, Typography, notification, Flex, Input, Select, DatePicker } from 'antd';
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
import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

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
  const [search, setSearch] = useState<string>('');
  const [searchError, setSearchError] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);

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

  const validateSearchText = (text: string): boolean => {
    if (!text) return true;
    return text.length >= 3;
  };

  const handleListPromotionCampaign = () => {
    const query = search && search.length >= 3 ? search : undefined;
    const start_time = startTime
      ? startTime.format('YYYY-MM-DD HH:mm:ss')
      : undefined;
    const end_time = endTime
      ? endTime.format('YYYY-MM-DD HH:mm:ss')
      : undefined;
    
    listPromotionCampaign({
      tenant_id: tenant?.id,
      page,
      page_size: pageSize,
      order_by: orderBy,
      order_direction: orderDirection,
      query,
      status: statusFilter as PromotionCampaignStatusEnum,
      start_time,
      end_time,
    });
  }

  const handleSearch = (searchValue: string) => {
    if (searchValue && !validateSearchText(searchValue)) {
      setSearchError('Please enter at least 3 characters');
      return;
    }
    
    setSearchError(undefined);
    setSearch(searchValue);
    setPage(1);
  }

  const handleStatusFilter = (status: PromotionCampaignStatusEnum | undefined) => {
    setStatusFilter(status);
    setPage(1);
  }

  const handleStartTimeChange = (date: Dayjs | null) => {
    setStartTime(date);
    setPage(1);
  }

  const handleEndTimeChange = (date: Dayjs | null) => {
    setEndTime(date);
    setPage(1);
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
    if (!search || search.length >= 3) {
      handleListPromotionCampaign();
    }
  }, [page, pageSize, orderBy, orderDirection, search, statusFilter, startTime, endTime]);

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
        left={(
          <Flex gap={theme.custom.spacing.small}>
            <Input.Search
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                if (value && value.length > 0 && value.length < 3) {
                  setSearchError('Please enter at least 3 characters');
                } else {
                  setSearchError(undefined);
                }
              }}
              onSearch={handleSearch}
              allowClear
              onClear={() => {
                setSearch('');
                setSearchError(undefined);
                setStatusFilter(undefined);
                setStartTime(null);
                setEndTime(null);
                setPage(1);
              }}
              status={searchError ? 'error' : undefined}
            />
          </Flex>
        )}
        right={(
          <Flex gap={theme.custom.spacing.small}>
            <Button
              type="text"
              icon={<Refresh color={theme.custom.colors.text.inverted} />}
              onClick={() => handleListPromotionCampaign()}
              loading={listPromotionCampaignLoading}
            />
            <DatePicker
              placeholder={t('common.startTime')}
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              value={startTime}
              onChange={handleStartTimeChange}
              style={{ width: 200 }}
              allowClear
            />
            <DatePicker
              placeholder={t('common.endTime')}
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              value={endTime}
              onChange={handleEndTimeChange}
              style={{ width: 200 }}
              allowClear
            />
            <Select
              placeholder={t('common.status')}
              style={{ width: 150 }}
              allowClear
              value={statusFilter}
              onChange={(value) => handleStatusFilter(value as PromotionCampaignStatusEnum)}
            >
              {Object.values(PromotionCampaignStatusEnum).map((status) => (
                <Select.Option key={status} value={status} style={{ textAlign: 'left' }}>
                  <DynamicTag value={status} />
                </Select.Option>
              ))}
            </Select>
          </Flex>
        )}
      />

      <LeftRightSection
        left={null}
        right={(
          <Flex gap={theme.custom.spacing.small}>
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
