import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Table, Typography } from 'antd';

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

export const ControllerListTableView: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      title: t('common.deviceId'), dataIndex: 'device_id', width: 128,
      render: (text: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/controllers/${record.id}/detail`)}>
          {text || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.status'), dataIndex: 'status', width: 128,
      render: (text: string) => <DynamicTag value={text} />,
    },
    {
      title: t('common.controllerName'), dataIndex: 'name', width: 256,
      render: (text: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/controllers/${record.id}/detail`)}>
          {text || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.firmware'), dataIndex: 'firmware_name', width: 128,
      render: (text: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/firmware/${record.firmware_id}/detail`)}>
          {text || '-'}
        </Typography.Link>
      ),
    },
    {
      title: t('common.totalRelays'), dataIndex: 'total_relays', width: 48,
    },
  ];  

  const {
    listController,
    data: listControllerData,
    loading: listControllerLoading,
  } = useListControllerApi<ListControllerResponse>();

  useEffect(() => {
    listController({ store_id: store.id, page, page_size: pageSize });
  }, [page, pageSize]);

  return (
    <BaseDetailSection title={t('common.controllers')} >
      <Table
        dataSource={listControllerData?.data || []}
        columns={columns}
        pagination={{
          pageSize,
          current: page,
          total: listControllerData?.total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
            listController({ store_id: store.id, page, page_size: pageSize });
          },
        }}
        loading={listControllerLoading}
        style={{ width: '100%' }}
      />
    </BaseDetailSection>
  );
};
