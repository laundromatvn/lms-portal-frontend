import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Dropdown,
  Flex,
  Table,
  theme,
  Typography,
} from 'antd';

import {
  MenuDots,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { DynamicTag } from '@shared/components/DynamicTag';

export const FirmwareListTable: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const columns = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      width: 128,
      render: (_: string, record: any) => (
        <Typography.Link onClick={() => navigate(`/firmwares/${record.id}/detail`)}>
          {record.name}
        </Typography.Link>
      ),
    },
    {
      title: t('common.version'),
      dataIndex: 'version',
      key: 'version',
      width: 128,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 128,
      render: (_: string, record: any) => <DynamicTag value={record.status} />,
    },
    {
      title: t('common.actions'),
      dataIndex: 'actions',
      key: 'actions',
      width: 128,
      render: (_: string, record: any) => {
        return (
          <Flex gap={theme.custom.spacing.medium}>
            <Button type="link" icon={<MenuDots size={18} />} />
          </Flex>
        );
      }
    },
  ];

  const [dataSource, setDataSource] = useState<any[]>([]);

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      style={{ width: '100%' }}
    />
  );
};
