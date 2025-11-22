import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, Input, Switch, type FormInstance } from 'antd';

import { BaseModal } from '@shared/components/BaseModal';

import { type Permission } from '@shared/types/Permission';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  permission: Permission;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (form: FormInstance) => void;
}

export const EditNewPermissionModal: React.FC<Props> = ({ permission, isModalOpen, setIsModalOpen, onSave }) => {
  const { t } = useTranslation();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      code: permission.code,
      name: permission.name,
      description: permission.description,
      is_enabled: permission.is_enabled,
    });
  }, [permission]);

  return (
    <BaseModal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      maskClosable
    >
      <BaseEditSection title={t('common.edit')} onSave={() => onSave(form)}>
        <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 600 }}>
          <Form.Item
            label={t('permission.name')}
            name="name"
            rules={[
              { required: true, message: t('messages.nameIsRequired') },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t('permission.code')}
            name="code"
            rules={[
              { required: true, message: t('messages.codeIsRequired') },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label={t('permission.isEnabled')}
            name="is_enabled"
            rules={[
              { required: true, message: t('messages.isEnabledIsRequired') },
            ]}
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label={t('permission.description')}
            name="description"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>  
      </BaseEditSection>
    </BaseModal>
  );
};
