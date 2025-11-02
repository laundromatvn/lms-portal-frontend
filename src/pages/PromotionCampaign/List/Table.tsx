import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Table, Dropdown, Typography } from 'antd';
import type { MenuProps } from 'antd';

import { MenuDots } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import type { PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';

import { tenantStorage } from '@core/storage/tenantStorage';

import {
  useListPromotionCampaignApi,
  type ListPromotionCampaignResponse,
} from '@shared/hooks/useListPromotionCampaignApi';

import { Box } from '@shared/components/Box';
import type { ColumnsType } from 'antd/es/table';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatDateTime } from '@shared/utils/date';

export const PromotionCampaignListTable: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tenant = tenantStorage.load();

  const columns: ColumnsType<PromotionCampaign> = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      width: 256,
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
      render: (value) => <DynamicTag value={value} />,
    },
    {
      title: t('common.startTime'),
      dataIndex: 'start_time',
      key: 'start_time',
      width: 128,
      render: (value) => formatDateTime(value),
    },
    {
      title: t('common.endTime'),
      dataIndex: 'end_time',
      key: 'end_time',
      width: 128,
      render: (value) => formatDateTime(value),
    },
    // {
    //   title: t('common.actions'),
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   width: 128,
    //   render: (_value, record) => {
    //     const items: MenuProps['items'] = [
    //       {
    //         key: 'detail',
    //         label: t('common.detail'),
    //       },
    //       {
    //         key: 'edit',
    //         label: t('common.edit'),
    //       },
    //     ];

    //     return (
    //       <Dropdown
    //         menu={{ items }}
    //         trigger={['click']}
    //       >
    //         <Button
    //           type="link"
    //           icon={<MenuDots weight="Bold" />}
    //         />
    //       </Dropdown>
    //     );
    //   },
    // },
  ];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: listPromotionCampaignData,
    loading: listPromotionCampaignLoading,
    error: listPromotionCampaignError,
    listPromotionCampaign,
  } = useListPromotionCampaignApi<ListPromotionCampaignResponse>();

  const handleListPromotionCampaign = () => {
    listPromotionCampaign({
      tenant_id: tenant?.id,
      page,
      page_size: pageSize,
    });
  }

  useEffect(() => {
    handleListPromotionCampaign();
  }, []);

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
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
        onChange={(pagination) => {
          listPromotionCampaign({
            tenant_id: tenantStorage.load()?.id,
            page: pagination.current,
            page_size: pagination.pageSize,
          });
        }}
      />
    </Box>
  );
};
