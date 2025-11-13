import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  type PaymentMethod,
  type QRPaymentMethodDetail,
} from '@shared/types/PaymentMethod';

export interface Props {
  paymentMethod: PaymentMethod;
}

export const QRDetails: React.FC<Props> = ({ paymentMethod }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const details = paymentMethod.details as QRPaymentMethodDetail;

  return (
    <Flex
      vertical
      gap={theme.custom.spacing.xsmall}
      style={{ width: '100%' }}
    >
      <Typography.Text type="secondary">{t('common.bankCode')}: {details.bank_code}</Typography.Text>
      <Typography.Text type="secondary">{t('common.bankName')}: {details.bank_name}</Typography.Text>
      <Typography.Text type="secondary">{t('common.bankAccountNumber')}: {details.bank_account_number}</Typography.Text>
      <Typography.Text type="secondary">{t('common.bankAccountName')}: {details.bank_account_name}</Typography.Text>
    </Flex>
  );
};
