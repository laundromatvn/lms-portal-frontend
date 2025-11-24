import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  type PaymentMethod,
  type QRVNPAYPaymentMethodDetail,
} from '@shared/types/PaymentMethod';

export interface Props {
  paymentMethod: PaymentMethod;
}

export const QRVNPAYDetails: React.FC<Props> = ({ paymentMethod }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const details = paymentMethod.details as QRVNPAYPaymentMethodDetail;

  return (
    <Flex
      vertical
      gap={theme.custom.spacing.xsmall}
      style={{ width: '100%' }}
    >
      <Typography.Text type="secondary">{t('common.merchantCode')}: {details.merchant_code}</Typography.Text>
      <Typography.Text type="secondary">{t('common.terminalCode')}: {details.terminal_code}</Typography.Text>
      <Typography.Text type="secondary">{t('common.initSecretKey')}: {details.init_secret_key}</Typography.Text>
      <Typography.Text type="secondary">{t('common.querySecretKey')}: {details.query_secret_key}</Typography.Text>
      <Typography.Text type="secondary">{t('common.ipnv3SecretKey')}: {details.ipnv3_secret_key}</Typography.Text>
    </Flex>
  );
};
