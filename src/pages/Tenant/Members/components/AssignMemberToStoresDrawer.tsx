import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Drawer,
  Flex,
  Button,
  List,
  notification,
  Form,
  Select,
  Typography,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListStoreApi,
  type ListStoreResponse,
} from '@shared/hooks/useListStoreApi';
import {
  useListAssignedStoresApi,
  type ListAssignedStoresResponse,
} from '@shared/hooks/useListAssignedStoresApi';
import { useAssignMemberToStoresApi } from '@shared/hooks/useAssignMemberToStoresApi';
import { useDeleteStoreMemberApi } from '@shared/hooks/useDeleteStoreMemberApi';

import { type Store } from '@shared/types/store';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { TrashBinTrash } from '@solar-icons/react';

interface Props {
  user_id: string;
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}

export const AssignMemberToStoresDrawer: React.FC<Props> = ({
  user_id,
  isDrawerOpen,
  setIsDrawerOpen,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

  const [availableStore, setAvailableStore] = useState<Store[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const {
    data: listStoreData,
    loading: listStoreLoading,
    listStore,
  } = useListStoreApi<ListStoreResponse>();
  const {
    data: listAssignedStoresData,
    loading: listAssignedStoresLoading,
    listAssignedStores,
  } = useListAssignedStoresApi<ListAssignedStoresResponse>();
  const {
    deleteStoreMember,
    loading: deleteStoreMemberLoading,
    data: deleteStoreMemberData,
    error: deleteStoreMemberError,
  } = useDeleteStoreMemberApi();
  const {
    assignMemberToStores,
    data: assignMemberToStoresData,
    error: assignMemberToStoresError,
  } = useAssignMemberToStoresApi();

  const handleAssignMemberToStores = () => {
    form.validateFields();

    const storeIds = form.getFieldsValue().store_ids;

    assignMemberToStores({ user_id, store_ids: storeIds });
  }

  useEffect(() => {
    listStore({ page, page_size: pageSize });
    listAssignedStores({ user_id, page, page_size: pageSize });
  }, [user_id]);

  useEffect(() => {
    if (listStoreData) {
      setAvailableStore(listStoreData.data?.filter((item) => {
        return !listAssignedStoresData?.data?.some((assignedItem) => assignedItem.id === item.id);
      }) || []);
    }
  }, [listStoreData, listAssignedStoresData]);

  useEffect(() => {
    if (assignMemberToStoresData) {
      api.success({
        message: t('tenant.members.assignMemberToStoresSuccess'),
      });
      listAssignedStores({ user_id, page, page_size: pageSize });
      onSuccess?.();
    }
  }, [assignMemberToStoresData]);

  useEffect(() => {
    if (assignMemberToStoresError) {
      api.error({
        message: t('tenant.members.assignMemberToStoresError'),
      });
    }
  }, [assignMemberToStoresError]);

  useEffect(() => {
    if (deleteStoreMemberData) {
      api.success({
        message: t('tenant.members.deleteStoreMemberSuccess'),
      });
      listAssignedStores({ user_id, page, page_size: pageSize });
      onSuccess?.();
    }
  }, [deleteStoreMemberData]);

  useEffect(() => {
    if (deleteStoreMemberError) {
      api.error({
        message: t('tenant.members.deleteStoreMemberError'),
      });
    }
  }, [deleteStoreMemberError]);

  return (
    <Drawer
      title={t('tenant.members.assignMemberToStores')}
      placement="right"
      onClose={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      width={600}
      styles={{
        body: {
          padding: theme.custom.spacing.medium,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      footer={(
        <Flex justify="space-between" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Button
            size="large"
            onClick={() => setIsDrawerOpen(false)}
            style={{ width: '100%' }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="primary"
            size="large"
            loading={listStoreLoading}
            onClick={handleAssignMemberToStores}
            style={{ width: '100%' }}
          >
            {t('tenant.members.assignMemberToStores')}
          </Button>
        </Flex>
      )}
    >
      {contextHolder}

      <Form
        layout="vertical"
        form={form}
      >
        <Form.Item
          name="store_ids"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('tenant.members.selectStoresIsRequired') }]}
        >
          <Select
            allowClear
            mode="multiple"
            size="large"
            placeholder={t('common.selectStores')}
            loading={listStoreLoading}
            options={availableStore.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Form.Item>
      </Form>

      <BaseDetailSection
        title={t('tenant.members.assignedStores')}
        loading={listAssignedStoresLoading}
        onRefresh={() => listAssignedStores({ user_id, page, page_size: pageSize })}
        style={{ width: '100%', height: '100%' }}
      >
        <List
          dataSource={listAssignedStoresData?.data}
          loading={listAssignedStoresLoading}
          style={{ width: '100%', height: '100%', overflowY: 'auto' }}
          pagination={{
            pageSize,
            current: page,
            total: listAssignedStoresData?.total,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          renderItem={(item) => (
            <List.Item
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: theme.custom.spacing.small,
                padding: theme.custom.spacing.medium,
                marginBottom: theme.custom.spacing.medium,
                backgroundColor: theme.custom.colors.background.light,
                borderRadius: theme.custom.radius.medium,
                border: `1px solid ${theme.custom.colors.neutral[200]}`,
              }}
            >
              <Flex justify="space-between" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
                <Typography.Link
                  onClick={() => navigate(`/stores/${item.id}/detail`)}
                  strong
                >
                  {item.name}
                </Typography.Link>

                <DynamicTag value={item.status} />
              </Flex>

              <Flex justify="space-between" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
                <Typography.Text type="secondary">{item.contact_phone_number}</Typography.Text>
                <Typography.Text type="secondary">{item.address}</Typography.Text>
              </Flex>

              <Flex justify="end" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
                <Button
                  size="small"
                  onClick={() => deleteStoreMember({ user_id, store_id: item.id })}
                  loading={deleteStoreMemberLoading}
                  style={{
                    color: theme.custom.colors.danger.default,
                    backgroundColor: theme.custom.colors.danger.light,
                    border: 'none',
                  }}
                  icon={<TrashBinTrash />}
                >
                  {t('common.delete')}
                </Button>
              </Flex>
            </List.Item>
          )}
        />
      </BaseDetailSection>
    </Drawer>
  );
};
