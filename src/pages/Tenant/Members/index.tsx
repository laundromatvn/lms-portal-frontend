import React, { use, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Typography, Table, Skeleton, notification } from 'antd';

import {
  Settings,
  KeySquare2
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListTenantMemberApi,
  type ListTenantMemberResponse,
} from '@shared/hooks/useListTenantMemberApi';

import { tenantStorage } from '@core/storage/tenantStorage';

import { PortalLayout } from '@shared/components/layouts/PortalLayout';
import LeftRightSection from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { BaseModal } from '@shared/components/BaseModal';

import { ConfigModalContent } from './ConfigModalContent';
import { ResetPasswordModalContent } from './ResetPasswordModalContent';
import { CreateNewMemberModalContent } from './CreateNewMemberModalContent';

export const ModalType = {
  CREATE_NEW_MEMBER: 'create_new_member',
  CONFIG: 'config',
  RESET_PASSWORD: 'reset_password',
} as const;

export type ModalType = (typeof ModalType)[keyof typeof ModalType];

export const TenantMemberListPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const tenant = tenantStorage.load();

  const [tableData, setTableData] = useState<any[] | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModalType, setSelectedModalType] = useState<ModalType | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 400 },
    { title: 'User Email', dataIndex: 'user_email', width: 400 },
    { title: 'User Phone', dataIndex: 'user_phone', width: 400 },
    { title: 'User Role', dataIndex: 'user_role', width: 400 },
    { title: 'User Status', dataIndex: 'user_status', width: 400 },
    { title: 'Actions', dataIndex: 'actions' },
  ];

  const {
    data: listTenantMemberData,
    loading: listTenantMemberLoading,
    error: listTenantMemberError,
    listTenantMember,
  } = useListTenantMemberApi<ListTenantMemberResponse>();

  const handleListTenantMember = () => {
    if (tenant) {
      listTenantMember({ tenant_id: tenant.id, page, page_size: pageSize });
    } else {
      listTenantMember({ page, page_size: pageSize });
    }
  }

  useEffect(() => {
    if (listTenantMemberData) {
      setTableData(listTenantMemberData?.data.map((item) => ({
        id: item.id,
        user_email: item.user_email,
        user_phone: item.user_phone,
        user_role: <DynamicTag value={item.user_role} />,
        user_status: <DynamicTag value={item.user_status} />,
        actions: (
          <Flex gap={theme.custom.spacing.medium}>
            <Button
              type="link"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedModalType(ModalType.CONFIG);
                setSelectedUserId(item.user_id);
              }}
            >
              <Settings size={20} />
            </Button>
            <Button
              type="link"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedModalType(ModalType.RESET_PASSWORD);
                setSelectedUserId(item.user_id);
              }}
            >
              <KeySquare2 size={20} />
            </Button>
          </Flex>
        ),
      })));
    }
  }, [listTenantMemberData]);

  useEffect(() => {
    if (listTenantMemberError) {
      api.error({
        message: t('messages.listTenantMemberError'),
      });
    }
  }, [listTenantMemberError]);

  useEffect(() => {
    handleListTenantMember();
  }, [page, pageSize]);

  useEffect(() => {
    if (!isModalOpen) {
      handleListTenantMember();
    }
  }, [isModalOpen]);

  return (
    <PortalLayout>
      {contextHolder}

      <Flex vertical style={{ height: '100%' }}>
        <Typography.Title level={2}>{t('navigation.tenantMembers')}</Typography.Title>

        <Flex vertical gap={theme.custom.spacing.medium} style={{ height: '100%' }}>
          <LeftRightSection
            left={null}
            right={(
              <Flex gap={theme.custom.spacing.medium}>
                <Button
                  type="default"
                  size="large"
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedModalType(ModalType.CREATE_NEW_MEMBER);
                  }}
                  style={{ minWidth: 128 }}
                >
                  {t('common.createNewMember')}
                </Button>
              </Flex>
            )}
          />

          {listTenantMemberLoading && <Skeleton active />}

          {!listTenantMemberLoading && (
            <Flex vertical gap={theme.custom.spacing.large}>
              <Table
                bordered
                dataSource={tableData || []}
                columns={columns}
                pagination={{
                  pageSize,
                  current: page,
                  total: listTenantMemberData?.total,
                  onChange: (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                  },
                }}
              />
            </Flex>
          )}
        </Flex>
      </Flex>

      <BaseModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        closable={true}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedModalType(null);
          setSelectedUserId(null);
        }}
        maskClosable={true}
      >
        {selectedModalType === ModalType.CONFIG && (
          <ConfigModalContent
            user_id={selectedUserId as string}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedModalType(null);
              setSelectedUserId(null);
            }}
          />
        )}

        {selectedModalType === ModalType.RESET_PASSWORD && (
          <ResetPasswordModalContent
            user_id={selectedUserId as string}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedModalType(null);
              setSelectedUserId(null);
            }}
          />
        )}

        {selectedModalType === ModalType.CREATE_NEW_MEMBER && (
          <CreateNewMemberModalContent tenant_id={tenant?.id as string} onClose={() => {
            setIsModalOpen(false);
            setSelectedModalType(null);
            setSelectedUserId(null);
          }}
        />
        )}
      </BaseModal>
    </PortalLayout>
  );
};
