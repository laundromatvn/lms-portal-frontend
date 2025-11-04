import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import dayjs, { type Dayjs } from 'dayjs';

import { Button, Dropdown, Typography, notification, Flex, Input, Select, DatePicker } from 'antd';
import type { MenuProps } from 'antd';

import {
  AddCircle,
  MenuDots,
  Refresh,
  TrashBinTrash,
  PauseCircle,
  PlayCircle,
  Calendar,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

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

import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';
import { Stack, StackCard } from '@shared/components/Stack';
import { CollapsableFilterSection } from '@shared/components/CollapsableFilterSection';

import { formatDateTime } from '@shared/utils/date';
import LeftRightSection from '@shared/components/LeftRightSection';
import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

export const PromotionCampaignListStack: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const tenant = tenantStorage.load();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // Use 5 for stack view
  const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc' | undefined>(undefined);
  const [search, setSearch] = useState<string>('');
  const [searchError, setSearchError] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  
  // Accumulate all loaded items for infinite scroll
  const [allItems, setAllItems] = useState<PromotionCampaign[]>([]);

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
  const {
    pausePromotionCampaign,
    data: pausePromotionCampaignData,
    error: pausePromotionCampaignError,
    loading: pausePromotionCampaignLoading,
  } = usePausePromotionCampaignApi();
  const {
    resumePromotionCampaign,
    data: resumePromotionCampaignData,
    error: resumePromotionCampaignError,
    loading: resumePromotionCampaignLoading,
  } = useResumePromotionCampaignApi();
  const {
    schedulePromotionCampaign,
    data: schedulePromotionCampaignData,
    error: schedulePromotionCampaignError,
    loading: schedulePromotionCampaignLoading,
  } = useSchedulePromotionCampaignApi();

  const validateSearchText = (text: string): boolean => {
    if (!text) return true;
    return text.length >= 3;
  };

  const handleListPromotionCampaign = useCallback(() => {
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
  }, [tenant?.id, page, pageSize, orderBy, orderDirection, search, statusFilter, startTime, endTime, listPromotionCampaign]);

  // Accumulate items when new data arrives
  useEffect(() => {
    if (listPromotionCampaignData?.data) {
      if (page === 1) {
        // Reset items on first page
        setAllItems(listPromotionCampaignData.data);
      } else {
        // Append new items for subsequent pages
        setAllItems((prev) => [...prev, ...listPromotionCampaignData.data]);
      }
    }
  }, [listPromotionCampaignData, page]);

  const handleSearch = (searchValue: string) => {
    if (searchValue && !validateSearchText(searchValue)) {
      setSearchError('Please enter at least 3 characters');
      return;
    }

    setSearchError(undefined);
    setSearch(searchValue);
    setPage(1);
    setAllItems([]); // Reset items on new search
  };

  const handleStatusFilter = (status: PromotionCampaignStatusEnum | undefined) => {
    setStatusFilter(status);
    setPage(1);
    setAllItems([]); // Reset items on filter change
  };

  const handleStartTimeChange = (date: Dayjs | null) => {
    setStartTime(date);
    setPage(1);
    setAllItems([]); // Reset items on filter change
  };

  const handleEndTimeChange = (date: Dayjs | null) => {
    setEndTime(date);
    setPage(1);
    setAllItems([]); // Reset items on filter change
  };

  const handleLoadMore = useCallback(() => {
    if (listPromotionCampaignData && page < listPromotionCampaignData.total_pages) {
      setPage((prev) => prev + 1);
    }
  }, [listPromotionCampaignData, page]);

  const hasMore = listPromotionCampaignData
    ? page < listPromotionCampaignData.total_pages
    : false;

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
      setAllItems([]);
      setPage(1);
      handleListPromotionCampaign();
    }
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
      setAllItems([]);
      setPage(1);
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
      setAllItems([]);
      setPage(1);
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
      setAllItems([]);
      setPage(1);
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

  const renderItem = (item: PromotionCampaign, index: number) => {
    const items: MenuProps['items'] = [
      {
        key: 'schedule',
        label: t('common.schedule'),
        onClick: () => schedulePromotionCampaign(item.id),
        icon: <Calendar weight="Outline" size={18} />,
        style: {
          color: theme.custom.colors.info.default,
        },
      },
      {
        key: 'pause',
        label: t('common.pause'),
        onClick: () => pausePromotionCampaign(item.id),
        icon: <PauseCircle weight="Outline" size={18} />,
        style: {
          color: theme.custom.colors.warning.default,
        },
      },
      {
        key: 'resume',
        label: t('common.resume'),
        onClick: () => resumePromotionCampaign(item.id),
        icon: <PlayCircle weight="Outline" size={18} />,
        style: {
          color: theme.custom.colors.success.default,
        },
      },
      {
        key: 'delete',
        label: t('common.delete'),
        onClick: () => deletePromotionCampaign(item.id),
        icon: <TrashBinTrash weight="Outline" size={18} />,
        style: {
          color: theme.custom.colors.danger.default,
        },
      },
    ];

    return (
      <StackCard onClick={() => navigate(`/promotion-campaigns/${item.id}/detail`)}>
        <StackCard.Header>
          <Flex justify="space-between" align="center" wrap="wrap" gap={theme.custom.spacing.small}>
            <Typography.Link
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/promotion-campaigns/${item.id}/detail`);
              }}
              style={{ fontSize: theme.custom.fontSize.large, fontWeight: 500 }}
            >
              {item.name}
            </Typography.Link>
            <DynamicTag value={item.status} />
          </Flex>
        </StackCard.Header>

        <StackCard.Content>
          <Typography.Text
            type="secondary"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word',
              lineHeight: '1.5',
            }}
          >
            {item.description || '-'}
          </Typography.Text>
          
          <Flex vertical gap={theme.custom.spacing.xsmall}>
            <Flex justify="space-between" wrap="wrap" gap={theme.custom.spacing.xsmall}>
              <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.small }}>
                {t('common.startTime')}:
              </Typography.Text>
              <Typography.Text style={{ fontSize: theme.custom.fontSize.small }}>
                {formatDateTime(item.start_time)}
              </Typography.Text>
            </Flex>
            {item.end_time && (
              <Flex justify="space-between" wrap="wrap" gap={theme.custom.spacing.xsmall}>
                <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.small }}>
                  {t('common.endTime')}:
                </Typography.Text>
                <Typography.Text style={{ fontSize: theme.custom.fontSize.small }}>
                  {formatDateTime(item.end_time)}
                </Typography.Text>
              </Flex>
            )}
          </Flex>
        </StackCard.Content>

        <StackCard.Action>
          <Dropdown
            menu={{ items }}
            trigger={['click']}
          >
            <Button
              type="text"
              icon={<MenuDots weight="Bold" />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        </StackCard.Action>
      </StackCard>
    );
  };

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      {contextHolder}

      <LeftRightSection
        left={(
          <Flex gap={theme.custom.spacing.small} wrap="wrap" style={{ width: '100%' }}>
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
                setAllItems([]);
              }}
              status={searchError ? 'error' : undefined}
            />
          </Flex>
        )}
        right={(
          <Flex gap={theme.custom.spacing.small} wrap="wrap" justify="end" style={{ width: '100%' }}>
            <Button
              type="text"
              icon={<Refresh color={theme.custom.colors.text.inverted} />}
              onClick={() => {
                setAllItems([]);
                setPage(1);
                handleListPromotionCampaign();
              }}
              loading={listPromotionCampaignLoading}
            />
            <CollapsableFilterSection onFilter={handleListPromotionCampaign}>
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
            </CollapsableFilterSection>
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

      <Stack
        data={allItems}
        renderItem={renderItem}
        loading={listPromotionCampaignLoading}
        initialDisplayCount={5}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        getItemKey={(item) => item.id}
      />
    </Box>
  );
};
