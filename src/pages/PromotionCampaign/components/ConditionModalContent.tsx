import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, InputNumber, Select, Button, Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  index?: number;
  condition?: PromotionCondition;
  onSave: (index: number | undefined, condition: PromotionCondition) => void;
  onCancel: () => void;
}

export const ConditionModalContent: React.FC<Props> = ({
  index,
  condition,
  onSave,
  onCancel,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  useEffect(() => {
    if (condition) {
      form.setFieldsValue(condition);
    } else {
      form.resetFields();
    }
  }, [condition, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(index, values as PromotionCondition);
      form.resetFields();
    });
  };

  return (
    <BaseEditSection title={t('common.condition')} saveButtonText={t('common.save')} onSave={handleSubmit}>
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%' }}
        initialValues={condition || {}}
      >
        <Form.Item
          label={t('common.type')}
          name="type"
          rules={[{ required: true, message: t('common.typeIsRequired') }]}
        >
          <Select
            size="large"
            options={[
              { label: t('promotionCampaign.condition_types.TENANTS'), value: 'TENANTS' },
              { label: t('promotionCampaign.condition_types.STORES'), value: 'STORES' },
              { label: t('promotionCampaign.condition_types.USERS'), value: 'USERS' },
              { label: t('promotionCampaign.condition_types.TOTAL_AMOUNT'), value: 'TOTAL_AMOUNT' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label={t('common.operator')}
          name="operator"
          rules={[{ required: true, message: t('common.operatorIsRequired') }]}
        >
          <Select
            size="large"
            options={[
              { label: t('promotionCampaign.operator.EQUAL'), value: 'EQUAL' },
              { label: t('promotionCampaign.operator.NOT_EQUAL'), value: 'NOT_EQUAL' },
              { label: t('promotionCampaign.operator.GREATER_THAN'), value: 'GREATER_THAN' },
              { label: t('promotionCampaign.operator.LESS_THAN'), value: 'LESS_THAN' },
              { label: t('promotionCampaign.operator.GREATER_THAN_OR_EQUAL'), value: 'GREATER_THAN_OR_EQUAL' },
              { label: t('promotionCampaign.operator.LESS_THAN_OR_EQUAL'), value: 'LESS_THAN_OR_EQUAL' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label={t('common.value')}
          name="value"
          rules={[{ required: true, message: t('common.valueIsRequired') }]}
        >
          <InputNumber size="large" style={{ width: '100%' }} />
        </Form.Item>
      </Form>

      <Flex justify="flex-end" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
      </Flex>
    </BaseEditSection>
  );
};

