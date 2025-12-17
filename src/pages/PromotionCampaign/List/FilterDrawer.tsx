import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Dayjs } from 'dayjs';

import { Button, Drawer, Flex, Select, DatePicker } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { DynamicTag } from '@shared/components/DynamicTag';

import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

export interface FilterConfig {
  status?: {
    options: Record<PromotionCampaignStatusEnum, string>;
    value?: PromotionCampaignStatusEnum;
  };
  startTime?: {
    value?: Dayjs | null;
  };
  endTime?: {
    value?: Dayjs | null;
  };
}

export interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    status?: PromotionCampaignStatusEnum;
    startTime?: Dayjs;
    endTime?: Dayjs;
  }) => void;
  initialFilters?: FilterConfig;
  title?: string;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  onApplyFilters,
  initialFilters,
  title,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [status, setStatus] = useState<PromotionCampaignStatusEnum>();
  const [startTime, setStartTime] = useState<Dayjs>();
  const [endTime, setEndTime] = useState<Dayjs>();

  useEffect(() => {
    if (open) {
      setStatus(initialFilters?.status?.value);
      setStartTime(initialFilters?.startTime?.value ?? undefined);
      setEndTime(initialFilters?.endTime?.value ?? undefined);
    }
  }, [open, initialFilters]);

  const handleApplyFilters = () => {
    onApplyFilters({
      status,
      startTime,
      endTime,
    });
    onClose();
  };

  const handleReset = () => {
    setStatus(undefined);
    setStartTime(undefined);
    setEndTime(undefined);
  };

  const hasFilters = status !== undefined || startTime !== null || endTime !== null;

  return (
    <Drawer
      title={title || t('common.filters')}
      open={open}
      onClose={onClose}
      width={isMobile ? '100%' : 480}
      footer={
        <Flex justify="space-between" gap={theme.custom.spacing.medium}>
          <Button size="large" onClick={handleReset} disabled={!hasFilters}>
            {t('common.reset')}
          </Button>
          <Flex gap={theme.custom.spacing.medium}>
            <Button size="large" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button size="large" type="primary" onClick={handleApplyFilters}>
              {t('common.apply')}
            </Button>
          </Flex>
        </Flex>
      }
      styles={{
        body: {
          padding: theme.custom.spacing.medium,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Flex vertical gap={theme.custom.spacing.large} style={{ width: '100%' }}>
        <Select
          size="large"
          placeholder={t('common.status')}
          style={{ width: '100%' }}
          allowClear
          value={status}
          onChange={(value) => setStatus(value)}
          options={Object.values(PromotionCampaignStatusEnum).map((status) => ({
            label: <DynamicTag value={status} />,
            value: status,
          }))}
        />

        <DatePicker
          size="large"
          placeholder={t('common.startTime')}
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: '100%' }}
          value={startTime}
          onChange={(value) => setStartTime(value ?? undefined)}
          allowClear
        />

        <DatePicker
          size="large"
          placeholder={t('common.endTime')}
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: '100%' }}
          value={endTime}
          onChange={(value) => setEndTime(value ?? undefined)}
          allowClear
        />
      </Flex>
    </Drawer>
  );
};
