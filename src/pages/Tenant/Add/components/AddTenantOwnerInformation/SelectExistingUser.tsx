import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Flex,
  Form,
  notification,
  Select,
} from 'antd';

import {
  useListUserTenantAdminApi,
  type ListUserTenantAdminResponse,
} from '@shared/hooks/user/useListUserTenantAdminApi';

import { type User } from '@shared/types/user';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  onSave: (newTenantOwner: User) => void;
}

export const SelectExistingUser: React.FC<Props> = ({ onSave }: Props) => {
  const { t } = useTranslation();

  const [selectedUser, setSelectedUser] = useState<User>();

  const {
    listUserTenantAdmin,
    data: listUserTenantAdminData,
    loading: listUserTenantAdminLoading,
  } = useListUserTenantAdminApi<ListUserTenantAdminResponse>();

  const handleSave = async () => {
    if (!selectedUser) return;

    onSave(selectedUser);
  };

  useEffect(() => {
    listUserTenantAdmin({ page: 1, page_size: 100 });
  }, [listUserTenantAdmin]);

  return (
    <BaseEditSection
      title={t('tenant.ownerAccount')}
      saveButtonText={t('common.continue')}
      onSave={handleSave}
      loading={listUserTenantAdminLoading}
    >
      <Flex style={{ width: '100%', maxWidth: 600 }}>
        <Select
          size="large"
          loading={listUserTenantAdminLoading}
          placeholder={t('tenant.selectExistingUser')}
          options={listUserTenantAdminData?.data?.map((item: User) => ({
            label: `${item.email} - ${item.phone}`,
            value: item.id,
          }))}
          onChange={(value) => {
            setSelectedUser(listUserTenantAdminData?.data?.find((item: User) => item.id === value) as User);
          }}
          style={{ width: '100%' }}
        />
      </Flex>
    </BaseEditSection>
  )
};
