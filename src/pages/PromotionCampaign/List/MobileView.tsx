import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { type Dayjs } from 'dayjs';

import {
  Button,
  List,
  Typography,
  notification,
  Flex,
  Input,
  Dropdown,
} from 'antd';

import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import {
  AddCircle,
  Filter,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';

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
import { Box } from '@shared/components/Box';
import { DynamicTag } from '@shared/components/DynamicTag';

import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

import { FilterDrawer } from './FilterDrawer';
import { formatDateTime } from '@shared/utils/date';


export const MobileView: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const can = useCan();

  const [api, contextHolder] = notification.useNotification();

  const tenant = tenantStorage.load();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
      query,
      status: statusFilter as PromotionCampaignStatusEnum,
      start_time,
      end_time,
    });
  }

  useEffect(() => {
    if (!search || search.length >= 3) {
      handleListPromotionCampaign();
    }
  }, [page, pageSize, search, statusFilter, startTime, endTime]);

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
    <PortalLayoutV2 title={t('common.promotionCampaign')} onBack={() => navigate(-1)}>
      <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        {contextHolder}

        <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
          <Input
            placeholder={t('common.search')}
            size="large"
            value={search}
            prefix={<SearchOutlined />}
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
              width: '100%',
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          />

          {can('promotion_campaign.create') && (
            <Button
              shape="circle"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate('/promotion-campaigns/add')}
              style={{
                backgroundColor: theme.custom.colors.background.light,
                color: theme.custom.colors.neutral.default,
              }}
            />
          )}

          <Button
            shape="circle"
            size="large"
            icon={<Filter />}
            onClick={() => setIsFilterDrawerOpen(true)}
            style={{
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          />
        </Flex>

        <List
          dataSource={listPromotionCampaignData?.data || []}
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
          renderItem={(item) => (
            <List.Item
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: theme.custom.spacing.small,
                width: '100%',
                padding: theme.custom.spacing.medium,
                marginBottom: theme.custom.spacing.medium,
                backgroundColor: theme.custom.colors.background.light,
                borderRadius: theme.custom.radius.medium,
                border: `1px solid ${theme.custom.colors.neutral[200]}`,
              }}
            >
              <Flex
                vertical
                gap={theme.custom.spacing.xsmall}
                style={{ width: '100%' }}
                onClick={() => navigate(`/promotion-campaigns/${item.id}/detail`)}
              >
                <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                  <Typography.Text>{item.name}</Typography.Text>
                  <DynamicTag value={item.status} type="text" />
                </Flex>

                <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
                  {t('common.startTime')}: {item.start_time ? formatDateTime(item.start_time) : t('common.unknown')}
                </Typography.Text>

                <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.xsmall }}>
                  {t('common.endTime')}: {item.end_time ? formatDateTime(item.end_time) : t('common.unknown')}
                </Typography.Text>
              </Flex>
            </List.Item>
          )}
        />
      </Box>

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
