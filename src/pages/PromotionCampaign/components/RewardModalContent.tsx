import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, InputNumber, Select, Button, Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionReward } from '@shared/types/promotion/PromotionReward';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  index?: number;
  reward?: PromotionReward;
  onSave: (index: number | undefined, reward: PromotionReward) => void;
  onCancel: () => void;
}

export const RewardModalContent: React.FC<Props> = ({ index, reward, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  useEffect(() => {
    if (reward) {
      form.setFieldsValue(reward);
    } else {
      form.resetFields();
    }
  }, [reward, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    onSave(index, values as PromotionReward);
    form.resetFields();
  };

  return (
    <BaseEditSection title={t('common.reward')} saveButtonText={t('common.save')} onSave={handleSubmit}>
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%' }}
        initialValues={reward || {}}
      >
        <Form.Item
          label={t('common.type')}
          name="type"
          rules={[{ required: true, message: t('common.typeIsRequired') }]}
        >
          <Select
            size="large"
            options={[
              { label: t('promotionCampaign.reward_types.FIXED_AMOUNT'), value: 'FIXED_AMOUNT' },
              { label: t('promotionCampaign.reward_types.PERCENTAGE_AMOUNT'), value: 'PERCENTAGE_AMOUNT' },
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

      <Flex justify="flex-end" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
      </Flex>
    </BaseEditSection>
  );
};

