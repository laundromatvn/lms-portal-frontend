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

import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';
import { type PromotionMetadataLimitOption } from '@shared/types/promotion/PromotionMetadata';

interface Props {
  open: boolean;
  onClose: () => void;
  index?: number;
  limit?: PromotionLimit;
  limitOptions?: PromotionMetadataLimitOption[];
  onSave: (index: number | undefined, limit: PromotionLimit) => void;
}

export const LimitDrawer: React.FC<Props> = ({
  open,
  onClose,
  index,
  limit,
  limitOptions,
  onSave,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [form] = Form.useForm();

  const [limitTypes, setLimitTypes] = useState<{ label: string; value: string }[]>([]);
  const [units, setUnits] = useState<{ label: string; value: string }[]>([]);

  const [selectedLimitOption, setSelectedLimitOption] = useState<PromotionMetadataLimitOption | undefined>(undefined);

  useEffect(() => {
    if (open && limit) {
      form.setFieldsValue(limit);
      const limitOption = limitOptions?.find((option) => option.limit_type === limit.type);
      if (limitOption) {
        setSelectedLimitOption(limitOption);
        const newUnits = limitOption.units?.map((unit) => ({
          label: t(`promotionCampaign.unit.${unit}`),
          value: unit,
        })) || [];
        setUnits(newUnits);
      }
    } else if (open && !limit) {
      form.resetFields();
      setSelectedLimitOption(undefined);
      setUnits([]);
    }
  }, [open, limit, limitOptions, form, t]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(index, values as PromotionLimit);
      form.resetFields();
      setSelectedLimitOption(undefined);
      setUnits([]);
      onClose();
    } catch (error) {
      // Form validation failed
      console.error('Form validation failed', error);
    }
  };

  useEffect(() => {
    // Only clear units and form values if no limit is being edited
    // This prevents clearing values when initializing from an existing limit
    if (!selectedLimitOption && !limit && open) {
      setUnits([]);
      form.setFieldsValue({ unit: undefined, value: undefined });
      return;
    }
  }, [selectedLimitOption, limit, open, form]);

  useEffect(() => {
    if (!limitOptions) return;

    setLimitTypes(limitOptions.map((limitOption) => ({
      label: t(`promotionCampaign.limit_types.${limitOption.limit_type}`),
      value: limitOption.limit_type,
    })));
  }, [limitOptions, t]);

  const handleCancel = () => {
    form.resetFields();
    setSelectedLimitOption(undefined);
    setUnits([]);
    onClose();
  };

  return (
    <Drawer
      title={t('common.limit')}
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
              options={limitTypes}
              onChange={(value) => {
                if (!value) {
                  setSelectedLimitOption(undefined);
                  setUnits([]);
                  form.setFieldsValue({ unit: undefined, value: undefined });
                  return;
                }

                const limitOption = limitOptions?.find((limitOption) => limitOption.limit_type === value);

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
      </Flex>
    </Drawer>
  );
};

