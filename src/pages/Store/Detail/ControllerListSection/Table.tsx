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
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  store: Store;
}

export const ControllerListTableView: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { title: t('common.deviceId'), dataIndex: 'device_id', width: 128 },
    { title: t('common.status'), dataIndex: 'status', width: 128 },
    { title: t('common.controllerName'), dataIndex: 'name' },
    { title: t('common.totalRelays'), dataIndex: 'total_relays' },
  ];

  const {
    listController,
    data: listControllerData,
    loading: listControllerLoading,
  } = useListControllerApi<ListControllerResponse>();

  useEffect(() => {
    if (listControllerData) {
      setDataSource(listControllerData.data.map((item) => ({
        device_id: <Typography.Link onClick={() => navigate(`/controllers/${item.id}/detail`)}>{item.device_id}</Typography.Link>,
        status: <DynamicTag value={item.status} />,
        name: <Typography.Link onClick={() => navigate(`/controllers/${item.id}/detail`)}>{item.name || '-'}</Typography.Link>,
        total_relays: item.total_relays,
        actions: null,
      })));
    }
  }, [listControllerData]);

  useEffect(() => {
    listController({ store_id: store.id, page, page_size: pageSize });
  }, [page, pageSize]);

  return (
    <BaseDetailSection title={t('common.controllers')} >
      <Table
        dataSource={dataSource}
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
