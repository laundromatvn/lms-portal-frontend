import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  Switch,
  type FormInstance,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { Box } from '@shared/components/Box';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (form: FormInstance) => void;
}

export const CreateNewPermissionDrawer: React.FC<Props> = ({ open, onClose, onSave }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [form] = Form.useForm();

  const handleSave = async () => {
    await form.validateFields();
    onSave(form.getFieldsValue());
  };

  return (
    <Drawer
      title={t('permission.addNewPermission')}
      open={open}
      onClose={onClose}
      width={isMobile ? '100%' : 600}
      footer={
        <Flex
          justify="space-between"
          gap={theme.custom.spacing.medium}
          style={{ width: '100%', marginTop: 'auto' }}
        >
          <Button
            size="large"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={handleSave}
            style={{ width: '100%' }}
          >
            {t('common.add')}
          </Button>
        </Flex>
      }
    >
      <Box
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', height: '100%' }}
      >
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
      </Box>
    </Drawer>
  );
};
