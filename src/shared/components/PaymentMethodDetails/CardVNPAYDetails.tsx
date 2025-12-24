import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import {
  type PaymentMethod,
  type CardVNPAYPaymentMethodDetail,
} from '@shared/types/PaymentMethod';

import { Box } from '../Box';
import { DataWrapper } from '../DataWrapper';
import { DynamicTag } from '../DynamicTag';

export interface Props {
  paymentMethod: PaymentMethod;
  showSecret?: boolean;
}

export const CardVNPAYDetails: React.FC<Props> = ({ paymentMethod, showSecret = false }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const details = paymentMethod.details as CardVNPAYPaymentMethodDetail;

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

      <DataWrapper title={t('common.merchantCode')} value={details.merchant_code} />
      <DataWrapper title={t('common.terminalCode')} value={details.terminal_code} />

      {showSecret && (
        <>
          <DataWrapper title={t('common.initSecretKey')} value={details.init_secret_key} />
          <DataWrapper title={t('common.querySecretKey')} value={details.query_secret_key} />
          <DataWrapper title={t('common.ipnv3SecretKey')} value={details.ipnv3_secret_key} />
        </>
      )}
    </Box>
  );
};
