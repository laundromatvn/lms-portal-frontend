import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Table, Skeleton, notification } from 'antd';

import {
  AddCircle,
  KeySquare2,
  PenNewSquare,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListTenantMemberApi,
  type ListTenantMemberResponse,
} from '@shared/hooks/useListTenantMemberApi';

import { tenantStorage } from '@core/storage/tenantStorage';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { LeftRightSection } from '@shared/components/LeftRightSection';
import { DynamicTag } from '@shared/components/DynamicTag';
import { BaseModal } from '@shared/components/BaseModal';
import { Box } from '@shared/components/Box';

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
    { title: t('common.id'), dataIndex: 'id', width: 400 },
    { title: t('common.email'), dataIndex: 'user_email', width: 400 },
    { title: t('common.phone'), dataIndex: 'user_phone', width: 400 },
    { title: t('common.role'), dataIndex: 'user_role', width: 400 },
    { title: t('common.status'), dataIndex: 'user_status', width: 400 },
    { title: t('common.actions'), dataIndex: 'actions' },
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
              icon={<PenNewSquare size={18} />}
              style={{
                color: theme.custom.colors.info.default,
              }}
            >
            </Button>
            <Button
              type="link"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedModalType(ModalType.RESET_PASSWORD);
                setSelectedUserId(item.user_id);
              }}
              icon={<KeySquare2 size={18} />}
              style={{
                color: theme.custom.colors.warning.default,
              }}
            />
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
    <PortalLayoutV2 title={t('navigation.tenantMembers')} onBack={() => navigate(-1)}>
      {contextHolder}

      <Flex vertical style={{ height: '100%' }}>
        <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Flex justify="flex-end" wrap gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
            <Button
              type="primary"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedModalType(ModalType.CREATE_NEW_MEMBER);
              }}
              icon={<AddCircle />}
            >
              {t('common.createNewMember')}
            </Button>
          </Flex>

          {listTenantMemberLoading && <Skeleton active />}

          {!listTenantMemberLoading && (
            <Flex vertical style={{ width: '100%', overflow: 'auto' }}>
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
        </Box>
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
        modalStyles={{
          body: {
            height: '100%',
            overflowY: 'auto',
          },
        }}
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
    </PortalLayoutV2>
  );
};
