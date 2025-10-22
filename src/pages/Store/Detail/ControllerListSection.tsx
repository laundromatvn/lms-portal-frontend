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

import { EditSection } from '@shared/components/EditSection';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  store: Store;
}

export const ControllerListSection: React.FC<Props> = ({ store }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { title: 'Controller ID', dataIndex: 'id', width: 100 },
    { title: 'Device ID', dataIndex: 'device_id', width: 100 },
    { title: 'Name', dataIndex: 'name', width: 300 },
    { title: 'Total Relays', dataIndex: 'total_relays', width: 100 },
    { title: 'Status', dataIndex: 'status', width: 100 },
    { title: 'Actions', dataIndex: 'actions' },
  ];

  const {
    listController,
    data: listControllerData,
    loading: listControllerLoading,
  } = useListControllerApi<ListControllerResponse>();

  useEffect(() => {
    if (listControllerData) {
      setDataSource(listControllerData.data.map((item) => ({
        id: item.id,
        device_id: item.device_id,
        name: item.name || '-',
        total_relays: item.total_relays,
        status: <DynamicTag value={item.status} />,
        actions: (
          <Flex gap={theme.custom.spacing.medium}>
            <Button type="link" onClick={() => navigate(`/controllers/${item.id}/detail`)}>
              {t('common.detail')}
            </Button>
          </Flex>
        ),
      })));
    }
  }, [listControllerData]);

  useEffect(() => {
    listController({ store_id: store.id, page, page_size: pageSize });
  }, [page, pageSize]);

  return (
    <EditSection title={t('common.controllers')} >
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
    </EditSection>
  );
};
