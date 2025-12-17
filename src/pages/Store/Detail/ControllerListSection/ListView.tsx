import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Flex, List, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListControllerApi,
  type ListControllerResponse,
} from '@shared/hooks/useListControllerApi';

import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  store: Store;
}

export const ListView: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  const {
    listController,
    data: listControllerData,
    loading: listControllerLoading,
  } = useListControllerApi<ListControllerResponse>();

  // Reset when store changes
  useEffect(() => {
    setPage(1);
  }, [store.id]);

  useEffect(() => {
    listController({ store_id: store.id, page, page_size: pageSize });
  }, [page, pageSize, store.id]);

  return (
    <BaseDetailSection title={t('common.controllers')} >
      <List
        dataSource={listControllerData?.data}
        loading={listControllerLoading}
        pagination={{
          pageSize: pageSize,
          total: listControllerData?.total || 0,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
        style={{ width: '100%' }}
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
            }}>
            <Typography.Link onClick={() => navigate(`/controllers/${item.id}/detail`)} strong>
              {`${item.name} (${item.device_id})` || '-'}
            </Typography.Link>

            <Flex justify="space-between" wrap="wrap" gap={theme.custom.spacing.xsmall}>
              <Typography.Link onClick={() => navigate(`/firmware/${item.firmware_id}/detail`)}>
                {`${item.firmware_name} (${item.firmware_version})` || '-'}
              </Typography.Link>
              <DynamicTag value={item.status} />
            </Flex>
          </List.Item>
        )}
      />
    </BaseDetailSection>
  );
};
