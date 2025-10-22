import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Form, InputNumber, Typography, Button, Card } from 'antd';

import { Play } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { useStartMachineApi, type StartMachineResponse } from '@shared/hooks/useStartMachineApi';

import { Box } from '@shared/components/Box';
import { type Machine } from '@shared/types/machine';
import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  machine: Machine;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const StartMachineModalContent: React.FC<Props> = ({ machine, onClose, onSuccess }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [amount, setAmount] = useState<number | null>(null);

  const {
    startMachine,
    loading: startMachineLoading,
  } = useStartMachineApi<StartMachineResponse>();

  const handleStartMachine = async () => {
    try {
      const values = await form.validateFields();
      await startMachine(machine.id, values.amount);
      onSuccess?.();
      onClose?.();
    } catch (error) {
      // Form validation error or API error will be handled by the hook
    }
  };

  const calculatePulses = (amount: number): number => {
    if (!amount || !machine.coin_value) return 0;
    return Math.floor(amount / machine.coin_value);
  };

  const handleAmountChange = (value: number | null) => {
    setAmount(value);
  };

  // Reset form and state when machine changes
  useEffect(() => {
    form.resetFields();
    setAmount(null);
  }, [machine.id, form]);

  return (
    <Flex
      vertical
      gap={theme.custom.spacing.medium}
      style={{
        width: '100%',
        minWidth: 500,
      }}
    >
      <Typography.Title level={3}>Start Machine - {machine.name}</Typography.Title>

      {/* Machine Information */}
      <Card size="small" title={t('common.machineInfo')}>
        <Flex vertical gap={theme.custom.spacing.small}>
          <Flex justify="space-between">
            <Typography.Text strong>{t('common.basePrice')}:</Typography.Text>
            <Typography.Text>{formatCurrencyCompact(machine.base_price)}</Typography.Text>
          </Flex>
          <Flex justify="space-between">
            <Typography.Text strong>{t('common.coinValue')}:</Typography.Text>
            <Typography.Text>{formatCurrencyCompact(machine.coin_value)}</Typography.Text>
          </Flex>
          <Flex justify="space-between">
            <Typography.Text strong>{t('common.pulseDuration')}:</Typography.Text>
            <Typography.Text>{machine.pulse_duration}ms</Typography.Text>
          </Flex>
        </Flex>
      </Card>

      <Box
        vertical
        gap={theme.custom.spacing.medium}
        style={{ width: '100%' }}
      >
        <Form form={form} layout="vertical" style={{ width: '100%' }}>
          <Form.Item
            label={t('common.amount')}
            name="amount"
            rules={[
              { required: true, message: t('common.amountRequired') },
              {
                validator: (_, value) => {
                  if (value <= 0) {
                    return Promise.reject(new Error(t('common.amountMustBeGreaterThanZero')));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber 
              size="large" 
              style={{ width: '100%' }} 
              placeholder={t('common.enterAmount')}
              min={1}
              onChange={handleAmountChange}
              addonAfter="đ"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => {
                const cleaned = value?.replace(/,/g, '') || '';
                return (cleaned === '' ? 1 : Number(cleaned)) as 1;
              }}
            />
          </Form.Item>

          {amount && amount > 0 && (
            <Card size="small" title={t('common.pulsePreview')} style={{ backgroundColor: theme.custom.colors.info.light }}>
              <Flex align="center" gap={theme.custom.spacing.small}>
                <Typography.Text strong>{t('common.numberOfPulses')}:</Typography.Text>
                <Typography.Text strong style={{ fontSize: '16px', color: theme.custom.colors.primary.default }}>
                  {calculatePulses(amount)}
                </Typography.Text>
              </Flex>
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                {t('common.pulseCalculationFormula')}: {formatCurrencyCompact(amount)} ÷ {formatCurrencyCompact(machine.coin_value)} = {calculatePulses(amount)}
              </Typography.Text>
            </Card>
          )}

          <Form.Item style={{ width: '100%', textAlign: 'right', marginTop: theme.custom.spacing.medium }}>
            <Button
              type="primary"
              size="large"
              onClick={handleStartMachine}
              loading={startMachineLoading}
              icon={<Play weight="Bold" />}
            >
              {t('common.startMachine')}
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </Flex>
  );
};
