import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { type Dayjs } from 'dayjs';

import {
  Button,
  Table,
  Dropdown,
  Typography,
  notification,
  Flex,
  Input,
} from 'antd';
import type { MenuProps } from 'antd';

import { SearchOutlined } from '@ant-design/icons';

import {
  AddCircle,
  MenuDots,
  TrashBinTrash,
  PauseCircle,
  PlayCircle,
  Calendar,
  Filter,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

import type { PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';

import { tenantStorage } from '@core/storage/tenantStorage';

import {
  useListPromotionCampaignApi,
  type ListPromotionCampaignResponse,
} from '@shared/hooks/promotion/useListPromotionCampaignApi';
import { useDeletePromotionCampaignApi } from '@shared/hooks/promotion/useDeletePromotionCampaignApi';
import { useSchedulePromotionCampaignApi } from '@shared/hooks/promotion/useSchedulePromotionCampaignApi';
import { usePausePromotionCampaignApi } from '@shared/hooks/promotion/usePausePromotionCampaignApi';
import { useResumePromotionCampaignApi } from '@shared/hooks/promotion/useResumePromotionCampaignApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import type { ColumnsType } from 'antd/es/table';
import { DynamicTag } from '@shared/components/DynamicTag';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { formatDateTime } from '@shared/utils/date';
import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

import { FilterDrawer } from './FilterDrawer';

export const DesktopView: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const can = useCan();

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

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const {
    data: listPromotionCampaignData,
    loading: listPromotionCampaignLoading,
    listPromotionCampaign,
  } = useListPromotionCampaignApi<ListPromotionCampaignResponse>();
  const {
    deletePromotionCampaign,
    data: deletePromotionCampaignData,
    error: deletePromotionCampaignError,
  } = useDeletePromotionCampaignApi<void>();
  const {
    pausePromotionCampaign,
    data: pausePromotionCampaignData,
    error: pausePromotionCampaignError,
  } = usePausePromotionCampaignApi();
  const {
    resumePromotionCampaign,
    data: resumePromotionCampaignData,
    error: resumePromotionCampaignError,
  } = useResumePromotionCampaignApi();
  const {
    schedulePromotionCampaign,
    data: schedulePromotionCampaignData,
    error: schedulePromotionCampaignError,
  } = useSchedulePromotionCampaignApi();

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

  const columns: ColumnsType<PromotionCampaign> = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      width: 156,
      sorter: true,
      sortOrder: orderBy === 'name' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (_, record) => (
        <Typography.Link onClick={() => navigate(`/promotion-campaigns/${record.id}/detail`)}>
          {record.name}
        </Typography.Link>
      ),
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
      key: 'description',
      width: 156,
      render: (_, record) => (
        <Typography.Text type="secondary" ellipsis>
          {record.description}
        </Typography.Text>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 64,
      sorter: true,
      sortOrder: orderBy === 'status' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (value) => <DynamicTag value={value} type="text" />,
    },
    {
      title: t('common.startTime'),
      dataIndex: 'start_time',
      key: 'start_time',
      width: 156,
      sorter: true,
      sortOrder: orderBy === 'start_time' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (value) => formatDateTime(value),
    },
    {
      title: t('common.endTime'),
      dataIndex: 'end_time',
      key: 'end_time',
      width: 156,
      sorter: true,
      sortOrder: orderBy === 'end_time' ? (orderDirection === 'asc' ? 'ascend' : 'descend') : undefined,
      render: (value) => (
        <Typography.Text>
          {value ? formatDateTime(value) : t('common.unknown')}
        </Typography.Text>
      ),
    },
    {
      title: t('common.actions'),
      dataIndex: 'actions',
      key: 'actions',
      width: 128,
      render: (_value, record) => {
        const items: MenuProps['items'] = [
          {
            key: 'schedule',
            label: t('common.schedule'),
            onClick: () => schedulePromotionCampaign(record.id),
            icon: <Calendar weight="Outline" size={18} />,
            style: {
              color: theme.custom.colors.info.default,
            },
          },
          {
            key: 'pause',
            label: t('common.pause'),
            onClick: () => pausePromotionCampaign(record.id),
            icon: <PauseCircle weight="Outline" size={18} />,
            style: {
              color: theme.custom.colors.warning.default,
            },
          },
          {
            key: 'resume',
            label: t('common.resume'),
            onClick: () => resumePromotionCampaign(record.id),
            icon: <PlayCircle weight="Outline" size={18} />,
            style: {
              color: theme.custom.colors.success.default,
            },
          },
          {
            key: 'delete',
            label: t('common.delete'),
            onClick: () => deletePromotionCampaign(record.id),
            icon: <TrashBinTrash weight="Outline" size={18} />,
            style: {
              color: theme.custom.colors.danger.default,
            },
          },
        ];

        return (
          <Dropdown
            menu={{ items }}
            trigger={['click']}
          >
            <Button
              type="link"
              icon={<MenuDots weight="Bold" />}
              disabled={(
                record.status === PromotionCampaignStatusEnum.FINISHED ||
                !can('promotion_campaign.update')
              )}
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
    if (deletePromotionCampaignData) {
      api.success({
        message: t('messages.deletePromotionCampaignSuccess'),
      });
    }

    handleListPromotionCampaign();
  }, [deletePromotionCampaignData]);

  useEffect(() => {
    if (deletePromotionCampaignError) {
      api.error({
        message: t('messages.deletePromotionCampaignError'),
      });
    }
  }, [deletePromotionCampaignError]);

  useEffect(() => {
    if (pausePromotionCampaignData) {
      api.success({
        message: t('messages.pausePromotionCampaignSuccess'),
      });
      handleListPromotionCampaign();
    }
  }, [pausePromotionCampaignData]);

  useEffect(() => {
    if (pausePromotionCampaignError) {
      api.error({
        message: t('messages.pausePromotionCampaignError'),
      });
    }
  }, [pausePromotionCampaignError]);

  useEffect(() => {
    if (resumePromotionCampaignData) {
      api.success({
        message: t('messages.resumePromotionCampaignSuccess'),
      });
      handleListPromotionCampaign();
    }
  }, [resumePromotionCampaignData]);

  useEffect(() => {
    if (resumePromotionCampaignError) {
      api.error({
        message: t('messages.resumePromotionCampaignError'),
      });
    }
  }, [resumePromotionCampaignError]);

  useEffect(() => {
    if (schedulePromotionCampaignData) {
      api.success({
        message: t('messages.schedulePromotionCampaignSuccess'),
      });
      handleListPromotionCampaign();
    }
  }, [schedulePromotionCampaignData]);

  useEffect(() => {
    if (schedulePromotionCampaignError) {
      api.error({
        message: t('messages.schedulePromotionCampaignError'),
      });
    }
  }, [schedulePromotionCampaignError]);

  return (
    <PortalLayoutV2
      title={t('common.promotionCampaign')}
      onBack={() => navigate(-1)}
    >
      <BaseDetailSection>
        {contextHolder}

        <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
          <Input
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
            allowClear
            prefix={<SearchOutlined />}
            onClear={() => {
              setSearch('');
              setSearchError(undefined);
              setStatusFilter(undefined);
              setStartTime(null);
              setEndTime(null);
              setPage(1);
            }}
            status={searchError ? 'error' : undefined}
            style={{
              width: 384,
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          />

          <Flex justify="flex-end" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
            {can('promotion_campaign.create') && (
              <Button
                icon={<AddCircle />}
                onClick={() => navigate('/promotion-campaigns/add')}
                style={{
                  backgroundColor: theme.custom.colors.background.light,
                  color: theme.custom.colors.neutral.default,
                }}
              >
                {t('common.addPromotionCampaign')}
              </Button>
            )}

            <Button
              shape="circle"
              icon={<Filter />}
              onClick={() => setIsFilterDrawerOpen(true)}
              style={{
                backgroundColor: theme.custom.colors.background.light,
                color: theme.custom.colors.neutral.default,
              }}
            />
          </Flex>
        </Flex>


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
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            style: { color: theme.custom.colors.text.tertiary },
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          onRow={() => {
            return {
              style: {
                backgroundColor: theme.custom.colors.background.light,
              },
            };
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
      </BaseDetailSection>

      <FilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApplyFilters={(filters: { status?: PromotionCampaignStatusEnum; startTime?: Dayjs; endTime?: Dayjs }) => {
          setStatusFilter(filters.status);
          setStartTime(filters.startTime ?? null);
          setEndTime(filters.endTime ?? null);
        }}
      />
    </PortalLayoutV2>
  );
};
