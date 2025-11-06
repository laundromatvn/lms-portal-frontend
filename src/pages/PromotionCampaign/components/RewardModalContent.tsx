import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, InputNumber, Select, Button, Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionReward } from '@shared/types/promotion/PromotionReward';
import { type PromotionMetadataRewardOption } from '@shared/types/promotion/PromotionMetadata';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  rewardOptions: PromotionMetadataRewardOption[];
  index?: number;
  reward?: PromotionReward;
  onSave: (index: number | undefined, reward: PromotionReward) => void;
  onCancel: () => void;
}

export const RewardModalContent: React.FC<Props> = ({ rewardOptions, index, reward, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  const [rewardTypes, setRewardTypes] = useState<{ label: string; value: string }[]>([]);
  const [units, setUnits] = useState<{ label: string; value: string }[]>([]);

  const [selectedRewardOption, setSelectedRewardOption] = useState<PromotionMetadataRewardOption | undefined>(undefined);

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
    setSelectedRewardOption(undefined);
  };

  useEffect(() => {
    if (!selectedRewardOption) {
      // Only clear units and form values if no reward is being edited
      // This prevents clearing values when initializing from an existing reward
      if (!reward) {
        setUnits([]);
        form.setFieldsValue({ unit: undefined, value: undefined });
      }
      return;
    }

    const newUnits = selectedRewardOption?.units?.map((unit) => ({
      label: t(`promotionCampaign.unit.${unit}`),
      value: unit,
    })) || [];
    
    setUnits(newUnits);

    // If there's only 1 unit, set it as default
    if (newUnits.length === 1 && !form.getFieldValue('unit')) {
      form.setFieldValue('unit', newUnits[0].value);
    }
  }, [selectedRewardOption, reward, form, t]);

  useEffect(() => {
    if (!rewardOptions) return;

    setRewardTypes(rewardOptions.map((rewardOption) => ({
      label: t(`promotionCampaign.reward_types.${rewardOption.reward_type}`),
      value: rewardOption.reward_type,
    })));
  }, [rewardOptions, t]);

  // Initialize selectedRewardOption when editing an existing reward
  useEffect(() => {
    if (reward && reward.type && rewardOptions && rewardOptions.length > 0) {
      const rewardOption = rewardOptions.find((option) => option.reward_type === reward.type);
      if (rewardOption) {
        setSelectedRewardOption(rewardOption);
        const newUnits = rewardOption.units?.map((unit) => ({
          label: t(`promotionCampaign.unit.${unit}`),
          value: unit,
        })) || [];
        setUnits(newUnits);
      }
    } else if (!reward) {
      // Reset when no reward is provided (adding new reward)
      setSelectedRewardOption(undefined);
      setUnits([]);
    }
  }, [reward, rewardOptions, t]);

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
            options={rewardTypes}
            onChange={(value) => {
              if (!value) {
                setSelectedRewardOption(undefined);
                setUnits([]);
                form.setFieldsValue({ unit: undefined, value: undefined });
                return;
              }

              const rewardOption = rewardOptions.find((rewardOption) => rewardOption.reward_type === value);
              setSelectedRewardOption(rewardOption || undefined);
              const newUnits = rewardOption?.units?.map((unit) => ({
                label: t(`promotionCampaign.unit.${unit}`),
                value: unit,
              })) || [];
              setUnits(newUnits);

              if (newUnits.length === 1) {
                form.setFieldValue('unit', newUnits[0].value);
              }
            }}
          />
        </Form.Item>

        {selectedRewardOption && (
          <>
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
                options={units}
                disabled={units.length === 1}
              />
            </Form.Item>
          </>
        )}
      </Form>

      <Flex justify="flex-end" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Button onClick={() => {
          setSelectedRewardOption(undefined);
          onCancel();
        }}>{t('common.cancel')}</Button>
      </Flex>
    </BaseEditSection>
  );
};

