import React from 'react';
import { useTranslation } from 'react-i18next';

import { Form, Input, Switch, type FormInstance } from 'antd';

import { BaseModal } from '@shared/components/BaseModal';
import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (form: FormInstance) => void;
}

export const CreateNewPermissionModal: React.FC<Props> = ({ isModalOpen, setIsModalOpen, onSave }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  return (
    <BaseModal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      maskClosable
    >
      <BaseEditSection title={t('permission.createNewPermission')} onSave={() => onSave(form)} saveButtonText={t('permission.create')}>
        <Form form={form} layout="vertical" style={{ width: '100%', maxWidth: 600 }}>
          <Form.Item
            label={t('permission.name')}
            name="name"
            rules={[
              { required: true, message: t('permission.messages.nameIsRequired') },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t('permission.code')}
            name="code"
            rules={[
              { required: true, message: t('permission.messages.codeIsRequired') },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t('permission.description')}
            name="description"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label={t('permission.isEnabled')}
            name="is_enabled"
            rules={[
              { required: true, message: t('permission.messages.isEnabledIsRequired') },
            ]}
          >
            <Switch />
          </Form.Item>
        </Form>
      </BaseEditSection>
    </BaseModal>
  );
};
