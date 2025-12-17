import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Drawer,
  Form,
  InputNumber,
  Select,
  Button,
  Flex,
  Input,
  TimePicker,
} from 'antd';

import dayjs from 'dayjs';

import { useTheme } from '@shared/theme/useTheme';
import { useIsMobile } from '@shared/hooks/useIsMobile';

import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';
import { type PromotionMetadataConditionOption } from '@shared/types/promotion/PromotionMetadata';
import { ConditionValueTypeEnum } from '@shared/enums/ConditionValueTypeEnum';

import { buildDisplayValue } from '../../helpers';

interface Props {
  open: boolean;
  onClose: () => void;
  index?: number;
  condition?: PromotionCondition;
  conditionOptions?: PromotionMetadataConditionOption[];
  onSave: (index: number | undefined, condition: PromotionCondition) => void;
}

export const ConditionDrawer: React.FC<Props> = ({
  open,
  onClose,
  index,
  condition,
  conditionOptions,
  onSave,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [form] = Form.useForm();

  const [conditionTypes, setConditionTypes] = useState<{ label: string; value: string }[]>([]);
  const [operators, setOperators] = useState<{ label: string; value: string }[]>([]);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  const [selectedConditionOption, setSelectedConditionOption] = useState<PromotionMetadataConditionOption | undefined>(undefined);

  useEffect(() => {
    if (open && condition) {
      const conditionOption = conditionOptions?.find((conditionOption) => conditionOption.condition_type === condition?.type);
      setSelectedConditionOption(conditionOption || undefined);

      // Convert ISO date strings to dayjs objects for TIME_IN_DAY value type
      const formValues = { ...condition };
      if (conditionOption?.value_type === ConditionValueTypeEnum.TIME_IN_DAY && Array.isArray(condition.value)) {
        try {
          formValues.value = [
            dayjs(condition.value[0]),
            dayjs(condition.value[1]),
          ];
        } catch (error) {
          console.error("Error converting time to dayjs object", error);
        }
      }

      form.setFieldsValue(formValues);
    } else if (open && !condition) {
      form.resetFields();
      setSelectedConditionOption(undefined);
    }
  }, [open, condition, conditionOptions, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const conditionOption = conditionOptions?.find((conditionOption) => conditionOption.condition_type === values.type);
      const displayValue = conditionOption ? buildDisplayValue(conditionOption, values.value) : '';

      const payload = {
        ...values,
        display_value: displayValue,
      };

      onSave(index, payload);
      form.resetFields();
      setSelectedConditionOption(undefined);
      onClose();
    } catch (error) {
      // Form validation failed
      console.error('Form validation failed', error);
    }
  };

  useEffect(() => {
    if (!selectedConditionOption) {
      setOperators([]);
      setOptions([]);
      return;
    }

    setOperators(selectedConditionOption?.operators?.map((operator) => ({
      label: t(`promotionCampaign.operator.${operator}`),
      value: operator,
    })) || []);

    setOptions(selectedConditionOption?.options?.map((option) => ({
      label: option.label,
      value: option.value,
    })) || []);
  }, [selectedConditionOption, t]);

  useEffect(() => {
    if (!conditionOptions) return;

    setConditionTypes(conditionOptions.map((condition) => ({
      label: t(`promotionCampaign.condition_types.${condition.condition_type}`),
      value: condition.condition_type,
    })));
  }, [conditionOptions, t]);

  const handleCancel = () => {
    form.resetFields();
    setSelectedConditionOption(undefined);
    onClose();
  };

  return (
    <Drawer
      title={t('common.condition')}
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
              options={conditionTypes}
              onChange={(value) => {
                const conditionOption = conditionOptions?.find((condition) => condition.condition_type === value) || undefined;
                setSelectedConditionOption(conditionOption);
                // Reset operator and value when type changes
                form.setFieldsValue({ operator: undefined, value: undefined });
              }}
            />
          </Form.Item>

          <Form.Item
            label={t('common.operator')}
            name="operator"
            rules={[{ required: true, message: t('common.operatorIsRequired') }]}
          >
            <Select
              size="large"
              options={operators}
            />
          </Form.Item>

          {selectedConditionOption && (
            <Form.Item
              label={t('common.value')}
              name="value"
              rules={[{ required: true, message: t('common.valueIsRequired') }]}
            >
              {selectedConditionOption?.value_type === ConditionValueTypeEnum.NUMBER && (
                <InputNumber size="large" style={{ width: '100%' }} />
              )}

              {selectedConditionOption?.value_type === ConditionValueTypeEnum.STRING && (
                <Input size="large" style={{ width: '100%' }} />
              )}

              {selectedConditionOption?.value_type === ConditionValueTypeEnum.OPTIONS && (
                <Select
                  size="large"
                  style={{ width: '100%' }}
                  options={options}
                  mode="multiple"
                />
              )}

              {selectedConditionOption?.value_type === ConditionValueTypeEnum.TIME_IN_DAY && (
                <TimePicker.RangePicker
                  size="large"
                  style={{ width: '100%' }}
                  format="HH:mm"
                  placeholder={[t('common.startTime'), t('common.endTime')]}
                />
              )}
            </Form.Item>
          )}
        </Form>
      </Flex>
    </Drawer>
  );
};

