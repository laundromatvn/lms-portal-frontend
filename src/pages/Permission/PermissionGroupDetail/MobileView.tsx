import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Flex,
  Button,
  Dropdown,
  notification,
} from 'antd';

import {
  AltArrowDown,
  TrashBinTrash,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';
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
import { useCan } from '@shared/hooks/useCan';

export const MobileView: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const can = useCan();

  const currentUser = userStorage.load();

  const permissionGroupId = useParams().id as string;

  const [api, contextHolder] = notification.useNotification();

  const {
    getPermissionGroup,
    data: permissionGroup,
    loading: permissionGroupLoading,
  } = useGetPermissionGroupApi<PermissionGroup>();

  const {
    deletePermissionGroup,
    loading: deletePermissionGroupLoading,
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
      }, 2000);

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

      <Flex
        justify="end"
        gap={theme.custom.spacing.small}
        style={{ width: '100%' }}
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

      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', marginTop: theme.custom.spacing.medium }}
      >
        <BasicInformationSection
          permissionGroup={permissionGroup}
          loading={permissionGroupLoading}
        />
      </Flex>
    </PortalLayoutV2>
  );
};
