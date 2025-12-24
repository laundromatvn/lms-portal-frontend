import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  type PaymentMethod,
  type QRPaymentMethodDetail,
} from '@shared/types/PaymentMethod';

import { Box } from '../Box';
import { DataWrapper } from '../DataWrapper';
import { DynamicTag } from '../DynamicTag';

export interface Props {
  paymentMethod: PaymentMethod;
}

export const QRVietQRDetails: React.FC<Props> = ({ paymentMethod }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const details = paymentMethod.details as QRPaymentMethodDetail;

  return (
    <Box
      vertical
      border
      gap={theme.custom.spacing.xsmall}
      style={{ width: '100%' }}
    >
      <Flex align="center" wrap="wrap" gap={theme.custom.spacing.xsmall} style={{ width: '100%' }}>
        <Typography.Text strong>
          {`${t(`common.${paymentMethod.payment_method.toLowerCase()}`)} (${t(`common.${paymentMethod.payment_provider.toLowerCase()}`)})`}
        </Typography.Text>

        <DynamicTag value={paymentMethod.is_enabled ? 'enabled' : 'disabled'} />
      </Flex>

      <DataWrapper title={t('common.bankName')} value={`(${details.bank_code}) ${details.bank_name}`} />
      <DataWrapper title={t('common.bankAccountNumber')} value={details.bank_account_number} />
      <DataWrapper title={t('common.bankAccountName')} value={details.bank_account_name} />
    </Box>
  );
};
