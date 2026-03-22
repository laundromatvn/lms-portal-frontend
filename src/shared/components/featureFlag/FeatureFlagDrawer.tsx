import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Drawer, Flex, Form, Input, Switch, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import type {
  CreateFeatureFlagParams,
  FeatureFlag,
  FeatureFlagScopeType,
  UpdateFeatureFlagParams,
} from '@shared/types/featureFlag';

import { FeatureFlagScopeSelector } from './FeatureFlagScopeSelector';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  flag?: FeatureFlag;
  loading: boolean;
  onSave: (data: CreateFeatureFlagParams | UpdateFeatureFlagParams) => void;
  onClose: () => void;
}

const KEY_PATTERN = /^[a-z][a-z0-9_]*$/;

export const FeatureFlagDrawer: React.FC<Props> = ({
  open,
  mode,
  flag,
  loading,
  onSave,
  onClose,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }
    if (mode === 'edit' && flag) {
      form.setFieldsValue({
        displayName: flag.displayName,
        description: flag.description,
        isEnabled: flag.isEnabled,
        scope: { scopeType: flag.scopeType, scopeIds: flag.scopeIds },
      });
    }
  }, [open, mode, flag, form]);

  const handleFinish = (values: {
    key?: string;
    displayName: string;
    description: string;
    isEnabled: boolean;
    scope: { scopeType: FeatureFlagScopeType; scopeIds: string[] };
  }) => {
    if (mode === 'create') {
      onSave({
        key: values.key!,
        displayName: values.displayName,
        description: values.description,
        isEnabled: values.isEnabled,
        scopeType: values.scope.scopeType,
        scopeIds: values.scope.scopeIds,
      } satisfies CreateFeatureFlagParams);
    } else {
      onSave({
        displayName: values.displayName,
        description: values.description,
        isEnabled: values.isEnabled,
        scopeType: values.scope.scopeType,
        scopeIds: values.scope.scopeIds,
      } satisfies UpdateFeatureFlagParams);
    }
  };

  return (
    <Drawer
      open={open}
      title={mode === 'create' ? t('featureFlag.createTitle') : t('featureFlag.editTitle')}
      onClose={onClose}
      width={600}
      destroyOnClose
      styles={{
        body: {
          padding: theme.custom.spacing.medium,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      footer={
        <Flex gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Button size="large" onClick={onClose} style={{ width: '100%' }}>
            {t('common.cancel')}
          </Button>
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={() => form.submit()}
            style={{ width: '100%' }}
          >
            {t('common.save')}
          </Button>
        </Flex>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          isEnabled: false,
          scope: { scopeType: 'all', scopeIds: [] },
        }}
      >
        <Flex vertical gap={theme.custom.spacing.medium}>
          <BaseDetailSection title={t('featureFlag.sections.basicInfo')}>
            {mode === 'create' ? (
              <Form.Item
                name="key"
                label={t('featureFlag.fields.key')}
                rules={[
                  { required: true, message: t('featureFlag.validation.keyRequired') },
                  { pattern: KEY_PATTERN, message: t('featureFlag.validation.keyFormat') },
                ]}
              >
                <Input size="large" placeholder="e.g. kiosk_v2_enabled" />
              </Form.Item>
            ) : (
              <Form.Item label={t('featureFlag.fields.key')}>
                <Typography.Text code>{flag?.key}</Typography.Text>
              </Form.Item>
            )}

            <Form.Item
              name="displayName"
              label={t('featureFlag.fields.displayName')}
              rules={[{ required: true, message: t('featureFlag.validation.displayNameRequired') }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item name="description" label={t('featureFlag.fields.description')}>
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="isEnabled"
              label={t('featureFlag.fields.enabled')}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </BaseDetailSection>

          <BaseDetailSection title={t('featureFlag.sections.scope')}>
            <Form.Item name="scope" label={t('featureFlag.fields.scope')}>
              <FeatureFlagScopeSelector
                value={form.getFieldValue('scope') ?? { scopeType: 'all', scopeIds: [] }}
                onChange={v => form.setFieldValue('scope', v)}
              />
            </Form.Item>
          </BaseDetailSection>
        </Flex>
      </Form>
    </Drawer>
  );
};
