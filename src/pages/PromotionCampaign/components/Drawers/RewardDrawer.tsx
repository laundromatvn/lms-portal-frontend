import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Drawer,
  Form,
  InputNumber,
  Select,
  Button,
  Flex,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { type PromotionReward } from '@shared/types/promotion/PromotionReward';
import { type PromotionMetadataRewardOption } from '@shared/types/promotion/PromotionMetadata';

interface Props {
  open: boolean;
  onClose: () => void;
  index?: number;
  reward?: PromotionReward;
  rewardOptions?: PromotionMetadataRewardOption[];
  onSave: (index: number | undefined, reward: PromotionReward) => void;
}

export const RewardDrawer: React.FC<Props> = ({
  open,
  onClose,
  index,
  reward,
  rewardOptions,
  onSave,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [form] = Form.useForm();

  const [rewardTypes, setRewardTypes] = useState<{ label: string; value: string }[]>([]);
  const [units, setUnits] = useState<{ label: string; value: string }[]>([]);

  const [selectedRewardOption, setSelectedRewardOption] = useState<PromotionMetadataRewardOption | undefined>(undefined);

  useEffect(() => {
    if (open && reward) {
      form.setFieldsValue(reward);
      const rewardOption = rewardOptions?.find((option) => option.reward_type === reward.type);
      if (rewardOption) {
        setSelectedRewardOption(rewardOption);
        const newUnits = rewardOption.units?.map((unit) => ({
          label: t(`promotionCampaign.unit.${unit}`),
          value: unit,
        })) || [];
        setUnits(newUnits);
      }
    } else if (open && !reward) {
      form.resetFields();
      setSelectedRewardOption(undefined);
      setUnits([]);
    }
  }, [open, reward, rewardOptions, form, t]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(index, values as PromotionReward);
      form.resetFields();
      setSelectedRewardOption(undefined);
      setUnits([]);
      onClose();
    } catch (error) {
      // Form validation failed
      console.error('Form validation failed', error);
    }
  };

  useEffect(() => {
    if (!selectedRewardOption) {
      // Only clear units and form values if no reward is being edited
      // This prevents clearing values when initializing from an existing reward
      if (!reward && open) {
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
  }, [selectedRewardOption, reward, open, form, t]);

  useEffect(() => {
    if (!rewardOptions) return;

    setRewardTypes(rewardOptions.map((rewardOption) => ({
      label: t(`promotionCampaign.reward_types.${rewardOption.reward_type}`),
      value: rewardOption.reward_type,
    })));
  }, [rewardOptions, t]);

  const handleCancel = () => {
    form.resetFields();
    setSelectedRewardOption(undefined);
    setUnits([]);
    onClose();
  };

  return (
    <Drawer
      title={t('common.reward')}
      open={open}
      onClose={handleCancel}
      width={isMobile ? '100%' : 480}
      styles={{
        body: {
          padding: theme.custom.spacing.medium,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      footer={
        <Flex justify="flex-end" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
          <Button
            size="large"
            onClick={handleCancel}
            style={{ width: '100%' }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={handleSubmit}
            style={{ width: '100%' }}
          >
            {t('common.save')}
          </Button>
        </Flex>
      }
    >
      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%', height: '100%' }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ width: '100%' }}
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

                const rewardOption = rewardOptions?.find((rewardOption) => rewardOption.reward_type === value);
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
      </Flex>
    </Drawer>
  );
};

