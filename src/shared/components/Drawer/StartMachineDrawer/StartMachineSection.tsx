import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Flex, InputNumber, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type Machine } from '@shared/types/machine';

import { Box } from '@shared/components/Box';

import { formatCurrencyCompact } from '@shared/utils/currency';
import { MachineTypeEnum } from '@shared/enums/MachineTypeEnum';

interface Props {
  machine: Machine;
  onAmountChange: (amount: number) => void;
}

export const StartMachineDrawerStartMachineSection: React.FC<Props> = ({ machine, onAmountChange }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  const basePrice = machine.machine_type === MachineTypeEnum.WASHER
    ? Number(machine.base_price) : Number(machine.base_price) * 10;
  const defaultAmounts = [
    basePrice,
    basePrice * 2,
    basePrice * 3,
    basePrice * 4,
    basePrice * 5,
  ];

  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    setAmount(basePrice);
    onAmountChange(basePrice);
  }, [machine]);

  const calculatePulses = (amount: number): number => {
    if (!amount || !machine.coin_value) return 0;
    return Math.floor(amount / machine.coin_value);
  };

  return (
    <Box vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
      <InputNumber
        size="large"
        value={amount}
        style={{ width: '100%' }}
        placeholder={t('common.enterAmount')}
        min={1}
        onChange={value => {
          setAmount(value || 0);
          onAmountChange(value || 0);
        }}
        addonAfter="đ"
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => {
          const cleaned = value?.replace(/,/g, '') || '';
          return (cleaned === '' ? 1 : Number(cleaned)) as 1;
        }}
      />

      <Flex justify="flex-end" wrap="wrap" gap={theme.custom.spacing.small}>
        {defaultAmounts.map((defaultAmount) => (
          <Button
            type="default"
            shape="round"
            size="large"
            onClick={() => {
              setAmount(defaultAmount);
              onAmountChange(defaultAmount);
            }}
            style={{ 
              backgroundColor: defaultAmount === amount
                ? theme.custom.colors.info.light
                : theme.custom.colors.neutral.light,
              borderColor: defaultAmount === amount
                ? theme.custom.colors.info.default
                : theme.custom.colors.neutral.light,
              color: defaultAmount === amount
                ? theme.custom.colors.info.default
                : theme.custom.colors.text.primary,
            }}
          >
            {formatCurrencyCompact(defaultAmount)}
          </Button>
        ))}
      </Flex>

      <Box
        vertical
        gap={theme.custom.spacing.small}
        style={{
          width: '100%',
          backgroundColor: theme.custom.colors.info.light,
          padding: theme.custom.spacing.small,
          borderRadius: theme.custom.radius.small,
        }}
      >
        <Typography.Text type="secondary">
          {t('common.numberOfPulses')}: <Typography.Text strong>{calculatePulses(amount)}</Typography.Text>
        </Typography.Text>

        <Typography.Text
          type="secondary"
          style={{ fontSize: theme.custom.fontSize.xsmall }}
        >
          {t('common.pulseCalculationFormula')}: {formatCurrencyCompact(amount)} ÷ {formatCurrencyCompact(machine.coin_value)} = {calculatePulses(amount)}
        </Typography.Text>
      </Box>
    </Box >
  );
};
