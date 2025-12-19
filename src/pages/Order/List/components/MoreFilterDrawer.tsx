import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Dayjs } from 'dayjs';

import { Button, Drawer, Flex, Select, DatePicker } from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import {
  useListStoreApi
} from '@shared/hooks/useListStoreApi';

import { Box } from '@shared/components/Box';

import dayjs from '@shared/utils/dayjs';

interface MoreFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { store_ids: string[]; start_datetime: string; end_datetime: string }) => void;
  initialFilters?: {
    store_ids: string[];
    start_datetime: string;
    end_datetime: string;
  };
}

export const MoreFilterDrawer: React.FC<MoreFilterDrawerProps> = ({ open, onClose, onApplyFilters, initialFilters }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [storeIds, setStoreIds] = useState<string[]>(initialFilters?.store_ids || []);
  const [startDatetime, setStartDatetime] = useState<Dayjs | null>(
    initialFilters?.start_datetime ? dayjs(initialFilters.start_datetime).startOf('day') : null
  );
  const [endDatetime, setEndDatetime] = useState<Dayjs | null>(
    initialFilters?.end_datetime ? dayjs(initialFilters.end_datetime).endOf('day') : null
  );

  useEffect(() => {
    if (open) {
      setStoreIds(initialFilters?.store_ids || []);
      setStartDatetime(initialFilters?.start_datetime ? dayjs(initialFilters.start_datetime).startOf('day') : null);
      setEndDatetime(initialFilters?.end_datetime ? dayjs(initialFilters.end_datetime).endOf('day') : null);
    }
  }, [open, initialFilters]);

  const {
    listStore,
    data: listStoreData,
    loading: listStoreLoading,
  } = useListStoreApi();

  const handleApplyFilters = () => {
    onApplyFilters({
      store_ids: storeIds,
      start_datetime: startDatetime ? startDatetime.startOf('day').toISOString() : '',
      end_datetime: endDatetime ? endDatetime.endOf('day').toISOString() : '',
    });
    onClose();
  };

  useEffect(() => {
    listStore({ page: 1, page_size: 100 });
  }, [open]);

  return (
    <Drawer
      title={t('order.list.filters')}
      open={open}
      onClose={onClose}
      width={isMobile ? '100%' : undefined}
      footer={
        <Flex justify="end" gap={theme.custom.spacing.medium}>
          <Button size="large" onClick={onClose}>{t('common.cancel')}</Button>
          <Button size="large" type="primary" onClick={handleApplyFilters}>{t('common.apply')}</Button>
        </Flex>
      }
    >
      <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%', height: '100%' }}>
        <Select
          size="large"
          mode="multiple"
          placeholder={t('order.list.selectStore')}
          loading={listStoreLoading}
          options={listStoreData?.data.map((store: any) => ({
            label: store.name,
            value: store.id,
          })) || []}
          value={storeIds}
          onChange={(value) => setStoreIds(value)}
          allowClear
          style={{ width: '100%', backgroundColor: theme.custom.colors.background.light }}
        />

        <DatePicker
          size="large"
          placeholder={t('common.startTime')}
          format="YYYY-MM-DD"
          style={{ width: '100%', backgroundColor: theme.custom.colors.background.light }}
          value={startDatetime}
          onChange={(value: Dayjs | null) => setStartDatetime(value)}
          allowClear
        />

        <DatePicker
          size="large"
          placeholder={t('common.endTime')}
          format="YYYY-MM-DD"
          style={{ width: '100%', backgroundColor: theme.custom.colors.background.light }}
          value={endDatetime}
          onChange={(value: Dayjs | null) => setEndDatetime(value)}
          allowClear
        />
      </Box>
    </Drawer>
  );
};
