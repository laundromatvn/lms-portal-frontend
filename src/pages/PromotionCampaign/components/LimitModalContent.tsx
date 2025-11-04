import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, InputNumber, Select, Button, Flex } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';
import { type PromotionMetadataLimitOption } from '@shared/types/promotion/PromotionMetadata';

import { BaseEditSection } from '@shared/components/BaseEditSection';

interface Props {
  limitOptions: PromotionMetadataLimitOption[];
  index?: number;
  limit?: PromotionLimit;
  onSave: (index: number | undefined, limit: PromotionLimit) => void;
  onCancel: () => void;
}

export const LimitModalContent: React.FC<Props> = ({ limitOptions, index, limit, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [form] = Form.useForm();

  const [limitTypes, setLimitTypes] = useState<{ label: string; value: string }[]>([]);
  const [units, setUnits] = useState<{ label: string; value: string }[]>([]);

  const [selectedLimitOption, setSelectedLimitOption] = useState<PromotionMetadataLimitOption | undefined>(undefined);

  useEffect(() => {
    if (limit) {
      form.setFieldsValue(limit);
    } else {
      form.resetFields();
    }
  }, [limit, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    onSave(index, values as PromotionLimit);
    form.resetFields();
    setSelectedLimitOption(undefined);
  };

  useEffect(() => {
    if (!selectedLimitOption) {
      setUnits([]);
      form.setFieldsValue({ unit: undefined, value: undefined });
      return;
    }
  }, [selectedLimitOption, form]);

  useEffect(() => {
    if (!limitOptions) return;

    setLimitTypes(limitOptions.map((limitOption) => ({
      label: t(`promotionCampaign.limit_types.${limitOption.limit_type}`),
      value: limitOption.limit_type,
    })));
  }, [limitOptions]);
  return (
    <BaseEditSection title={t('common.limit')} saveButtonText={t('common.save')} onSave={handleSubmit}>
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
            options={limitTypes}
            onChange={(value) => {
              if (!value) {
                setSelectedLimitOption(undefined);
                setUnits([]);
                form.setFieldsValue({ unit: undefined, value: undefined });
                return;
              }

              const limitOption = limitOptions.find((limitOption) => limitOption.limit_type === value);

              setSelectedLimitOption(limitOption || undefined);

              const newUnits = limitOption?.units?.map((unit) => ({
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

        {selectedLimitOption && (
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
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
      </Flex>
    </BaseEditSection>
  );
};

