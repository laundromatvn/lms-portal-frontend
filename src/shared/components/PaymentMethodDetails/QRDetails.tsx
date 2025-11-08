import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { type PaymentMethod } from '@shared/types/PaymentMethod';

export interface QRDetailsProps {
  paymentMethod: PaymentMethod;
}

export const QRDetails: React.FC<QRDetailsProps> = ({ paymentMethod }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Flex
      vertical
      gap={theme.custom.spacing.xsmall}
      style={{ width: '100%' }}
    >
      <Typography.Text type="secondary">{t('common.bankCode')}: {paymentMethod.details.bank_code}</Typography.Text>
      <Typography.Text type="secondary">{t('common.bankName')}: {paymentMethod.details.bank_name}</Typography.Text>
      <Typography.Text type="secondary">{t('common.bankAccountNumber')}: {paymentMethod.details.bank_account_number}</Typography.Text>
      <Typography.Text type="secondary">{t('common.bankAccountName')}: {paymentMethod.details.bank_account_name}</Typography.Text>
    </Flex>
  );
};
