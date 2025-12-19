import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Flex,
  List,
  Typography,
} from 'antd';

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

export const MobileView: React.FC<Props> = ({ store }) => {
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

  const handleListController = () => {
    listController({ store_id: store.id, page, page_size: pageSize });
  };

  useEffect(() => {
    setPage(1);
  }, [store.id]);

  useEffect(() => {
    handleListController();
  }, [page, pageSize, store.id]);

  return (
    <BaseDetailSection
      title={t('common.controllers')}
      onRefresh={handleListController}
    >
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
            onClick={() => navigate(`/controllers/${item.id}/detail`)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
              gap: theme.custom.spacing.xsmall,
              padding: theme.custom.spacing.small,
              marginBottom: theme.custom.spacing.medium,
              backgroundColor: theme.custom.colors.background.light,
              borderRadius: theme.custom.radius.medium,
              border: `1px solid ${theme.custom.colors.neutral[200]}`,
            }}
          >
            <Flex justify="space-between" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
              <Typography.Text
                ellipsis
                style={{
                  flex: 1,
                  minWidth: 0,
                  marginRight: theme.custom.spacing.xsmall,
                }}
              >
                {`${item.name} (${item.device_id})` || '-'}
              </Typography.Text>

              <Flex style={{ flexShrink: 0 }}>
                <DynamicTag value={item.status} type="text" />
              </Flex>
            </Flex>

            <Typography.Text type="secondary" style={{ fontSize: theme.custom.fontSize.small }}>
              {item.firmware_name ? `${item.firmware_name} (${item.firmware_version})` : t('common.unknown')}
            </Typography.Text>
          </List.Item>
        )}
      />
    </BaseDetailSection>
  );
};
