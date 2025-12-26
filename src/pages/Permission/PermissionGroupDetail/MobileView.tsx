import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Flex,
  Button,
  Dropdown,
  Segmented,
  notification,
} from 'antd';

import {
  AltArrowDown,
  TrashBinTrash,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
import { useCan } from '@shared/hooks/useCan';
import { userStorage } from '@core/storage/userStorage';

import {
  useGetPermissionGroupApi,
} from '@shared/hooks/permissionGroup/useGetPermissionGroupApi';
import {
  useDeletePermissionGroupApi,
} from '@shared/hooks/permissionGroup/useDeletePermissionGroupApi';

import { type PermissionGroup } from '@shared/types/PermissionGroup';
import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import { BasicInformationSection } from './components/BasicInformationSection';
import { PermissionSection } from './components/PermissionSection';

const TABS = {
  BASIC_INFORMATION: 'basic_information',
  PERMISSIONS: 'permissions',
}

export const MobileView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const currentUser = userStorage.load();

  const permissionGroupId = useParams().id as string;

  const [api, contextHolder] = notification.useNotification();

  const [selectedTab, setSelectedTab] = useState<string>(TABS.BASIC_INFORMATION);

  const segmentedOptions = [
    {
      label: t('common.basicInformation'),
      value: TABS.BASIC_INFORMATION,
    },
    {
      label: t('common.permissions'),
      value: TABS.PERMISSIONS,
    },
  ];

  const {
    getPermissionGroup,
    data: permissionGroup,
    loading: permissionGroupLoading,
  } = useGetPermissionGroupApi<PermissionGroup>();

  const {
    deletePermissionGroup,
    data: deletePermissionGroupData,
    error: deletePermissionGroupError,
  } = useDeletePermissionGroupApi<boolean>();

  const canDeletePermissionGroup = () => {
    if (!can('permission_group.delete')) return false;
    if (!permissionGroup) return false;
    if (!currentUser) return false;

    if (!permissionGroup.tenant_id) {
      return currentUser.role === UserRoleEnum.ADMIN;
    }

    return true;
  }

  useEffect(() => {
    if (deletePermissionGroupData) {
      navigate("/permissions");
    }
  }, [deletePermissionGroupData]);

  useEffect(() => {
    if (deletePermissionGroupError) {
      api.error({
        message: t('permission.messages.deletePermissionGroupError'),
      });

      const timer = setTimeout(() => {
        navigate("/permissions");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [deletePermissionGroupError]);

  useEffect(() => {
    if (permissionGroupId) {
      getPermissionGroup(permissionGroupId);
    }
  }, [permissionGroupId]);

  return (
    <PortalLayoutV2
      title={permissionGroup?.name}
      onBack={() => navigate("/permissions")}
    >
      {contextHolder}

      <Flex justify="end" style={{ width: '100%' }}>
        <Segmented
          options={segmentedOptions}
          value={selectedTab}
          onChange={(value) => setSelectedTab(value)}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            padding: theme.custom.spacing.xxsmall,
          }}
        />
      </Flex>

      {selectedTab === TABS.BASIC_INFORMATION && (
        <Flex
          justify="end"
          gap={theme.custom.spacing.small}
          style={{ width: '100%', marginTop: theme.custom.spacing.medium }}
        >
          <Dropdown
            menu={{
              items: [
                {
                  key: 'delete',
                  label: t('common.delete'),
                  onClick: () => deletePermissionGroup(permissionGroupId),
                  icon: <TrashBinTrash />,
                  style: { color: theme.custom.colors.danger.default },
                  disabled: !canDeletePermissionGroup(),
                },
              ],
            }}
          >
            <Button
              icon={<AltArrowDown />}
              style={{
                color: theme.custom.colors.neutral.default,
                backgroundColor: theme.custom.colors.background.light,
              }}
            >
              {t('common.actions')}
            </Button>
          </Dropdown>
        </Flex>
      )}

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', marginTop: theme.custom.spacing.medium }}
      >
        {selectedTab === TABS.BASIC_INFORMATION && (
          <BasicInformationSection
            permissionGroup={permissionGroup}
            loading={permissionGroupLoading}
          />
        )}

        {selectedTab === TABS.PERMISSIONS && (
          <PermissionSection
            permissionGroup={permissionGroup}
            loading={permissionGroupLoading}
          />
        )}
      </Flex>
    </PortalLayoutV2>
  );
};
