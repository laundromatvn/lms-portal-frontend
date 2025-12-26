import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Form,
  Select,
  type FormInstance,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  useListPermissionGroupApi,
  type ListPermissionGroupRequest,
  type ListPermissionGroupResponse,
} from '@shared/hooks/permissionGroup/useListPermissionGroupApi';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  form: FormInstance<any>;
  onChange: (values: any) => void;
}

export const PermissionGroup: React.FC<Props> = ({ form, onChange }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [filters, _] = useState<ListPermissionGroupRequest>({
    page: 1,
    page_size: 100,
    search: '',
  });

  const {
    listPermissionGroup,
    data: listPermissionGroupData,
    loading: listPermissionGroupLoading,
  } = useListPermissionGroupApi<ListPermissionGroupResponse>();

  const handleListPermissionGroup = () => {
    listPermissionGroup(filters);
  };

  useEffect(() => {
    handleListPermissionGroup();
  }, [filters]);

  useEffect(() => {
    form.setFieldsValue({
      permission_group_id: null,
    });
  }, []);

  return (
    <BaseEditSection title={t('subscriptionPlan.permissionGroup')}>
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%', maxWidth: 600 }}
        onValuesChange={(_, values) => onChange(values)}
      >
        <Form.Item
          label={t('permission.permissionGroup')}
          name="permission_group_id"
          style={{ width: '100%' }}
          rules={[{ required: true, message: t('permission.messages.permissionGroupIsRequired') }]}
        >
          <Select
            size="large"
            style={{
              width: '100%',
              backgroundColor: theme.custom.colors.background.light,
            }}
            options={listPermissionGroupData?.data.map((permissionGroup) => ({
              label: permissionGroup.name,
              value: permissionGroup.id,
            }))}
            loading={listPermissionGroupLoading}
            disabled={listPermissionGroupLoading}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Form>
    </BaseEditSection>
  );
};
