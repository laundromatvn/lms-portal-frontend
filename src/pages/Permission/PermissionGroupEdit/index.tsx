import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  type FormInstance,
  notification,
} from 'antd';

import {
  useGetPermissionGroupApi,
} from '@shared/hooks/permissionGroup/useGetPermissionGroupApi';
import {
  useUpdatePermissionGroupApi,
  type UpdatePermissionGroupResponse,
} from '@shared/hooks/permissionGroup/useUpdatePermissionGroupApi';

import { type PermissionGroup } from '@shared/types/PermissionGroup';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { BasicInformationEdit } from './components/BasicInformationEdit';

export const PermissionGroupEditPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const permissionGroupId = useParams().id as string;

  const {
    getPermissionGroup,
    data: permissionGroup,
  } = useGetPermissionGroupApi<PermissionGroup>();

  const {
    updatePermissionGroup,
    data: updatePermissionGroupData,
    error: updatePermissionGroupError,
  } = useUpdatePermissionGroupApi<UpdatePermissionGroupResponse>();

  const handleSave = (form: FormInstance) => {
    updatePermissionGroup(permissionGroupId, {
      name: form.getFieldValue('name'),
      description: form.getFieldValue('description'),
      is_enabled: form.getFieldValue('is_enabled'),
    });
  };

  useEffect(() => {
    if (permissionGroupId) {
      getPermissionGroup(permissionGroupId);
    }
  }, [permissionGroupId]);

  useEffect(() => {
    if (updatePermissionGroupData) {
      api.success({
        message: t('permission.messages.updatePermissionGroupSuccess'),
      });

      const timer = setTimeout(() => {
        navigate(`/permission-groups/${permissionGroupId}/detail`);
      }, 2000);
  
      return () => clearTimeout(timer);
    }
  }, [updatePermissionGroupData]);

  useEffect(() => {
    if (updatePermissionGroupError) {
      api.error({
        message: t('permission.messages.updatePermissionGroupError'),
      });
    }
  }, [updatePermissionGroupError]);

  return (
    <PortalLayoutV2
      title={permissionGroup?.name}
      onBack={() => navigate(`/permission-groups/${permissionGroupId}/detail`)}
    >
      {contextHolder}

      <BasicInformationEdit
        permissionGroup={permissionGroup}
        onSave={handleSave}
      />
    </PortalLayoutV2>
  );
};
