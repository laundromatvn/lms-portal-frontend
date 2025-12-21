import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Popconfirm,
  Flex,
  List,
  Typography,
} from 'antd';

import {
  TrashBinTrash,
  Rocket2,
  ArchiveDown,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  type ListFirmwareRequest,
  type ListFirmwareResponse,
} from '@shared/hooks/firmware/useListFirmwareApi';

import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  data: ListFirmwareResponse | null;
  loading: boolean;
  onFiltersChange: (filters: ListFirmwareRequest) => void;
  onDeleteFirmware: (firmwareId: string) => void;
  onReleaseFirmware: (firmwareId: string) => void;
  onDeprecateFirmware: (firmwareId: string) => void;
}

export const ListView: React.FC<Props> = ({
  data,
  loading,
  onFiltersChange,
  onDeleteFirmware,
  onReleaseFirmware,
  onDeprecateFirmware,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    onFiltersChange({
      page: data?.page || 1,
      page_size: data?.page_size || 10,
      order_by: 'created_at',
      order_direction: 'desc',
    });
  }, [page, pageSize]);

  return (
    <Flex style={{ width: '100%', height: '100%' }}>
      <List
        dataSource={data?.data || []}
        loading={loading}
        pagination={{
          pageSize: pageSize,
          current: page,
          total: data?.total,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          style: { color: theme.custom.colors.text.tertiary },
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
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
              padding: theme.custom.spacing.small,
              marginBottom: theme.custom.spacing.small,
              backgroundColor: theme.custom.colors.background.light,
              borderRadius: theme.custom.radius.medium,
              border: `1px solid ${theme.custom.colors.neutral[200]}`,
            }}
          >
            <Flex vertical style={{ width: '100%' }} onClick={() => navigate(`/firmware/${item.id}/detail`)}>
              <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                <Typography.Text>{item.name}</Typography.Text>
                <DynamicTag value={item.status} type="text" />
              </Flex>

              <Flex justify="space-between" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
                <Typography.Text type="secondary">{item.version}</Typography.Text>
                <DynamicTag value={item.version_type} type="text" />
              </Flex>
            </Flex>

            <Flex
              justify="end"
              gap={theme.custom.spacing.small}
              style={{ width: '100%', marginTop: theme.custom.spacing.small }}
            >
              <Button
                icon={<Rocket2 />}
                style={{ backgroundColor: theme.custom.colors.background.light }}
                onClick={() => onReleaseFirmware(item.id)}
              >
                {t('common.release')}
              </Button>

              <Button
                icon={<ArchiveDown />}
                style={{ backgroundColor: theme.custom.colors.background.light }}
                onClick={() => onDeprecateFirmware(item.id)}
              >
                {t('common.deprecate')}
              </Button>

              <Popconfirm
                title={t('firmware.deleteFirmwareConfirm')}
                onConfirm={() => onDeleteFirmware(item.id)}
                onCancel={() => { }}
                okText={t('common.delete')}
                cancelText={t('common.cancel')}
              >
                <Button
                  icon={<TrashBinTrash />}
                  style={{
                    color: theme.custom.colors.danger.default,
                    backgroundColor: theme.custom.colors.danger.light,
                    border: 'none',
                  }}
                />
              </Popconfirm>
            </Flex>
          </List.Item>
        )}
      />
    </Flex>
  );
};
