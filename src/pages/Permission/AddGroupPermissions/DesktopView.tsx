import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Transfer,
  Button,
  Flex,
  notification,
  Input,
  Spin,
} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { TransferProps } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListPermissionApi,
  type ListPermissionResponse,
} from '@shared/hooks/permission/useListPermissionApi';
import {
  useListGroupPermissionsApi,
  type ListGroupPermissionsResponse,
} from '@shared/hooks/permissionGroup/useListGroupPermissionsApi';
import {
  useAddGroupPermissionsApi,
} from '@shared/hooks/permissionGroup/useAddGroupPermissionsApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';

export const DesktopView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  const permissionGroupId = useParams().id as string;

  const [api, contextHolder] = notification.useNotification();

  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const {
    listPermission,
    data: listPermissionData,
    loading: listPermissionLoading,
    error: listPermissionError,
  } = useListPermissionApi<ListPermissionResponse>();

  const {
    listGroupPermissions,
    data: listGroupPermissionsData,
    loading: listGroupPermissionsLoading,
  } = useListGroupPermissionsApi<ListGroupPermissionsResponse>();

  const {
    addGroupPermissions,
    data: addGroupPermissionsData,
    error: addGroupPermissionsError,
  } = useAddGroupPermissionsApi();

  const handleListPermission = React.useCallback(() => {
    listPermission({
      page: 1,
      page_size: 1000,
      search: debouncedSearch,
    });
  }, [listPermission, debouncedSearch]);

  const handleListGroupPermissions = React.useCallback(() => {
    if (!permissionGroupId) return;

    listGroupPermissions(permissionGroupId, {
      page: 1,
      page_size: 1000,
      search: '',
    });
  }, [listGroupPermissions, permissionGroupId]);

  const handleSave = async () => {
    if (!permissionGroupId) return;

    addGroupPermissions(permissionGroupId, {
      permission_codes: targetKeys,
    });
  };

  useEffect(() => {
    if (listGroupPermissionsData?.data) {
      const existingPermissionCodes = listGroupPermissionsData.data.map((p) => p.code);
      setTargetKeys(existingPermissionCodes);
    }
  }, [listGroupPermissionsData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    handleListGroupPermissions();
  }, [handleListGroupPermissions]);

  useEffect(() => {
    handleListPermission();
  }, [handleListPermission]);

  useEffect(() => {
    if (addGroupPermissionsData) {
      api.success({
        message: t('permission.addGroupPermissionsSuccess'),
      });
      navigate(`/permission-groups/${permissionGroupId}/detail`);
    }
  }, [addGroupPermissionsData]);

  useEffect(() => {
    if (addGroupPermissionsError) {
      api.error({
        message: t('permission.addGroupPermissionsError'),
      });
    }
  }, [addGroupPermissionsError]);

  useEffect(() => {
    if (listPermissionError) {
      api.error({
        message: t('permission.messages.listPermissionError'),
      });
    }
  }, [listPermissionError]);

  const handleChange: TransferProps['onChange'] = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys.map(String));
  };

  const handleSelectChange: TransferProps['onSelectChange'] = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys.map(String), ...targetSelectedKeys.map(String)]);
  };

  const handleFilter = (inputValue: string, item: { title: string; description: string }) => {
    return (
      item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.description?.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  return (
    <PortalLayoutV2
      title={t('permission.addGroupPermissions')}
      onBack={() => navigate(-1)}
    >
      {contextHolder}

      <BaseDetailSection>
        <Flex
          justify="space-between"
          align="center"
          gap={theme.custom.spacing.medium}
          style={{ width: '100%' }}
        >
          <Input
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            prefix={<SearchOutlined />}
            style={{
              width: '100%',
              maxWidth: 312,
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          />

          <Button
            icon={<PlusOutlined />}
            onClick={handleSave}
            style={{
              backgroundColor: theme.custom.colors.background.light,
              color: theme.custom.colors.neutral.default,
            }}
          >
            {t('common.save')}
          </Button>
        </Flex>

        <Flex
          vertical
          gap={theme.custom.spacing.medium}
          style={{
            width: '100%',
            height: '100%',
            marginTop: theme.custom.spacing.medium,
            overflowY: 'auto',
          }}
        >
          <Spin spinning={listPermissionLoading || listGroupPermissionsLoading}>
            <Transfer
              dataSource={(listPermissionData?.data || []).map((item) => ({
                key: item.code,
                title: item.name,
                description: item.description || '',
              }))}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={handleChange}
              onSelectChange={handleSelectChange}
              filterOption={handleFilter}
              render={(item) => item.title}
              showSearch
              titles={[
                t('permission.availablePermissions') || 'Available Permissions',
                t('permission.selectedPermissions') || 'Selected Permissions',
              ]}
              style={{
                width: '100%',
                height: '100%',
              }}
              listStyle={{
                width: '100%',
                height: '100%',
                maxHeight: 500,
              }}
            />
          </Spin>
        </Flex>
      </BaseDetailSection>
    </PortalLayoutV2>
  );
};
