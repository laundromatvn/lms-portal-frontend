import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Table, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListControllerApi,
  type ListControllerResponse,
} from '@shared/hooks/useListControllerApi';

import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { Stack, StackCard } from '@shared/components/Stack';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  store: Store;
}

export const ControllerListStackView: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  const {
    listController,
    data: listControllerData,
    loading: listControllerLoading,
  } = useListControllerApi<ListControllerResponse>();

  useEffect(() => {
    if (!listControllerData) return;

    // If it's page 1, replace the data. Otherwise, append to existing data
    if (listControllerData.page === 1) {
      setDataSource(listControllerData.data);
    } else {
      setDataSource((prev) => [...prev, ...listControllerData.data]);
    }
  }, [listControllerData]);

  // Reset when store changes
  useEffect(() => {
    setPage(1);
    setDataSource([]);
  }, [store.id]);

  useEffect(() => {
    listController({ store_id: store.id, page, page_size: pageSize });
  }, [page, pageSize, store.id]);

  return (
    <BaseDetailSection title={t('common.controllers')} >
      <Stack
        data={dataSource}
        loading={listControllerLoading}
        renderItem={(item) => (
          <StackCard style={{ padding: theme.custom.spacing.small }}>
            <StackCard.Header>
              <Typography.Link onClick={() => navigate(`/controllers/${item.id}/detail`)} strong>
                {`${item.name} (${item.device_id})` || '-'}
              </Typography.Link>
            </StackCard.Header>
            <StackCard.Content>
              <Flex justify="space-between" wrap="wrap" gap={theme.custom.spacing.xsmall}>
                <Typography.Link onClick={() => navigate(`/firmware/${item.firmware_id}/detail`)}>
                  {`${item.firmware_name} (${item.firmware_version})` || '-'}
                </Typography.Link>
                <DynamicTag value={item.status} />
              </Flex>
            </StackCard.Content>
          </StackCard>
        )}
        initialDisplayCount={2}
        hasMore={page < (listControllerData?.total_pages || 0)}
        onLoadMore={() => setPage(page + 1)}
      />
    </BaseDetailSection>
  );
};
