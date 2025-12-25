import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  type FormInstance,
  notification,
} from 'antd';

import {
  useCreatePermissionGroupApi,
  type CreatePermissionGroupResponse,
} from '@shared/hooks/permissionGroup/useCreatePermissionGroupApi';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';
import { BasicInformationAdd } from './components/BasicInformationAdd';

export const PermissionGroupAddPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const {
    createPermissionGroup,
    data: createPermissionGroupData,
    error: createPermissionGroupError,
  } = useCreatePermissionGroupApi<CreatePermissionGroupResponse>();

  const handleSave = (form: FormInstance) => {
    createPermissionGroup({
      name: form.getFieldValue('name'),
      description: form.getFieldValue('description'),
      is_enabled: form.getFieldValue('is_enabled'),
    });
  };

  useEffect(() => {
    if (createPermissionGroupData) {
      api.success({
        message: t('permission.messages.addPermissionGroupSuccess'),
      });

      const timer = setTimeout(() => {
        navigate("/permissions");
      }, 2000);
  
      return () => clearTimeout(timer);
    }
  }, [createPermissionGroupData]);

  useEffect(() => {
    if (createPermissionGroupError) {
      api.error({
        message: t('permission.messages.addPermissionGroupError'),
      });
    }
  }, [createPermissionGroupError]);

  return (
    <PortalLayoutV2
      title={t('permission.addPermissionGroup')}
      onBack={() => navigate("/permissions")}
    >
      {contextHolder}

      <BasicInformationAdd
        onSave={handleSave}
      />
    </PortalLayoutV2>
  );
};
