import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, InputNumber, Select, Button, Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';

interface Props {
  limit?: PromotionLimit;
  onSave: (limit: PromotionLimit) => void;
  onCancel: () => void;
}

export const LimitModalContent: React.FC<Props> = ({ limit, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  useEffect(() => {
    if (limit) {
      form.setFieldsValue(limit);
    } else {
      form.resetFields();
    }
  }, [limit, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(values as PromotionLimit);
      form.resetFields();
    });
  };

  return (
    <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%', height: '100%' }}>
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%' }}
        initialValues={limit || {}}
      >
        <Form.Item
          label={t('common.type')}
          name="type"
          rules={[{ required: true, message: t('common.typeIsRequired') }]}
        >
          <Select
            size="large"
            options={[
              { label: t('promotionCampaign.limit_types.TOTAL_USAGE'), value: 'TOTAL_USAGE' },
              { label: t('promotionCampaign.limit_types.USAGE_PER_USER'), value: 'USAGE_PER_USER' },
              { label: t('promotionCampaign.limit_types.USAGE_PER_STORE'), value: 'USAGE_PER_STORE' },
              { label: t('promotionCampaign.limit_types.USAGE_PER_TENANT'), value: 'USAGE_PER_TENANT' },
              { label: t('promotionCampaign.limit_types.TOTAL_AMOUNT'), value: 'TOTAL_AMOUNT' },
              { label: t('promotionCampaign.limit_types.AMOUNT_PER_USER'), value: 'AMOUNT_PER_USER' },
              { label: t('promotionCampaign.limit_types.AMOUNT_PER_STORE'), value: 'AMOUNT_PER_STORE' },
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

        <Form.Item
          label={t('common.unit')}
          name="unit"
          rules={[{ required: true, message: t('common.unitIsRequired') }]}
        >
          <Select
            size="large"
            options={[
              { label: t('promotionCampaign.unit.ORDER'), value: 'ORDER' },
              { label: t('promotionCampaign.unit.AMOUNT'), value: 'AMOUNT' },
              { label: t('promotionCampaign.unit.PERCENTAGE'), value: 'PERCENTAGE' },
              { label: t('promotionCampaign.unit.VND'), value: 'VND' },
            ]}
          />
        </Form.Item>
      </Form>

      <Flex justify="flex-end" gap={theme.custom.spacing.small}>
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="primary" onClick={handleSubmit}>
          {t('common.save')}
        </Button>
      </Flex>
    </Flex>
  );
};

