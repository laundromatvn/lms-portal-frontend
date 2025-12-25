import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from 'antd';

import { type PermissionGroup } from '@shared/types/PermissionGroup';

import { DataWrapper } from '@shared/components/DataWrapper';
import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatDateTime } from '@shared/utils/date';

interface Props {
  permissionGroup: PermissionGroup | null;
  loading?: boolean;
}

export const BasicInformationSection: React.FC<Props> = ({ permissionGroup, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <BaseDetailSection
      title={t('common.basicInformation')}
      loading={loading}
      onEdit={() => navigate(`/permission-groups/${permissionGroup?.id}/edit`)}
    >
      <DataWrapper title={t('common.name')} value={permissionGroup?.name} />

      <DataWrapper title={t('common.createdAt')}>
        <Typography.Text type="secondary">
          {formatDateTime(permissionGroup?.created_at || '')}
        </Typography.Text>
      </DataWrapper>

      <DataWrapper title={t('common.updatedAt')}>
        <Typography.Text type="secondary">
          {formatDateTime(permissionGroup?.updated_at || '')}
        </Typography.Text>
      </DataWrapper>

      <DataWrapper title={t('common.status')}>
        <DynamicTag value={permissionGroup?.is_enabled ? 'enabled' : 'disabled'} />
      </DataWrapper>

      <DataWrapper title={t('common.tenantName')}>
        {permissionGroup?.tenant_id ? (
          <Typography.Link onClick={() => navigate(`/tenant/list/${permissionGroup?.tenant_id}`)}>
            {permissionGroup?.tenant_name}
          </Typography.Link>
        ) : (
          <Typography.Text type="secondary">
            {t('common.unknown')}
          </Typography.Text>
        )}
      </DataWrapper>

      <DataWrapper title={t('common.description')}>
        <Typography.Text type="secondary">
          {permissionGroup?.description}
        </Typography.Text>
      </DataWrapper>
    </BaseDetailSection>
  );
};
