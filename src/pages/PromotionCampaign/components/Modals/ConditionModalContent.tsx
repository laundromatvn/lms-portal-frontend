import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
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

import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';
import { type PromotionMetadataConditionOption } from '@shared/types/promotion/PromotionMetadata';
import { ConditionValueTypeEnum } from '@shared/enums/ConditionValueTypeEnum';

import { BaseEditSection } from '@shared/components/BaseEditSection';

import { buildDisplayValue } from '../../helpers';

interface Props {
  index?: number;
  condition?: PromotionCondition;
  conditionOptions?: PromotionMetadataConditionOption[];
  onSave: (index: number | undefined, condition: PromotionCondition) => void;
  onCancel: () => void;
}

export const ConditionModalContent: React.FC<Props> = ({
  index,
  condition,
  conditionOptions,
  onSave,
  onCancel,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  const [conditionTypes, setConditionTypes] = useState<{ label: string; value: string }[]>([]);
  const [operators, setOperators] = useState<{ label: string; value: string }[]>([]);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  const [selectedConditionOption, setSelectedConditionOption] = useState<PromotionMetadataConditionOption | undefined>(undefined);

  useEffect(() => {
    if (condition) {
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
    } else {
      form.resetFields();
    }
  }, [condition, conditionOptions, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const conditionOption = conditionOptions?.find((conditionOption) => conditionOption.condition_type === values.type);
    const displayValue = conditionOption ? buildDisplayValue(conditionOption, values.value) : '';

    const payload = {
      ...values,
      display_value: displayValue,
    }

    onSave(index, payload);
    form.resetFields();
  };

  const buildInitialValues = () => {
    if (!condition) return {type: undefined, operator: undefined, value: undefined};

    if (selectedConditionOption?.value_type === ConditionValueTypeEnum.TIME_IN_DAY) {
      return {
        type: condition.type,
        operator: condition.operator,
        value: [dayjs(condition.value[0]), dayjs(condition.value[1])],
      };
    }

    return condition;
  };

  useEffect(() => {
    if (!selectedConditionOption) return;

    setOperators(selectedConditionOption?.operators?.map((operator) => ({
      label: t(`promotionCampaign.operator.${operator}`),
      value: operator,
    })) || []);

    setOptions(selectedConditionOption?.options?.map((option) => ({
      label: option.label,
      value: option.value,
    })) || []);
  }, [selectedConditionOption]);

  useEffect(() => {
    if (!conditionOptions) return;

    setConditionTypes(conditionOptions.map((condition) => ({
      label: t(`promotionCampaign.condition_types.${condition.condition_type}`),
      value: condition.condition_type,
    })));
  }, [conditionOptions]);

  return (
    <BaseEditSection title={t('common.condition')} saveButtonText={t('common.save')} onSave={handleSubmit}>
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%' }}
        initialValues={buildInitialValues()}
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
              setSelectedConditionOption(conditionOptions?.find((condition) => condition.condition_type === value) || undefined);
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

      <Flex justify="flex-end" gap={theme.custom.spacing.small} style={{ width: '100%' }}>
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
      </Flex>
    </BaseEditSection>
  );
};

