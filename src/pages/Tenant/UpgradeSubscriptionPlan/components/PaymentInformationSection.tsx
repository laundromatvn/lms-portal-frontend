import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Flex,
  QRCode,
  Skeleton,
  Typography,
} from 'antd';
import { useTheme } from '@shared/theme/useTheme';

import {
  useGetInternalPaymentInformationApi,
  type GetInternalPaymentInformationResponse,
} from '@shared/hooks/useGetInternalPaymentInformationApi';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { Box } from '@shared/components/Box';
import { DataWrapper } from '@shared/components/DataWrapper';


export const PaymentInformationSection: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    getInternalPaymentInformation,
    data: internalPaymentInformation,
    loading: internalPaymentInformationLoading,
  } = useGetInternalPaymentInformationApi<GetInternalPaymentInformationResponse>();

  useEffect(() => {
    getInternalPaymentInformation();
  }, []);

  if (internalPaymentInformationLoading) {
    return <Skeleton active />;
  }

  return (
    <BaseDetailSection title={t('subscription.paymentInformation')}>
      <QRCode
        value={internalPaymentInformation?.bank_account_qr_code || ''}
      />

      <Flex vertical gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        <Typography.Text>
          {t('subscription.pleaseConfirmAfterTransferSuccess')}
        </Typography.Text>

        <Button type="primary">
          {t('subscription.confirmTransferSuccess')}
        </Button>
      </Flex>

      <Box
        vertical
        gap={theme.custom.spacing.medium}
        style={{
          width: '100%',
          backgroundColor: theme.custom.colors.neutral[100],
        }}
      >
        <DataWrapper title={t('common.bankName')} value={`(${internalPaymentInformation?.bank_code}) ${internalPaymentInformation?.bank_name}`} />
        <DataWrapper title={t('common.bankAccountNumber')} value={internalPaymentInformation?.bank_account} />
        <DataWrapper title={t('common.bankAccountName')} value={internalPaymentInformation?.bank_account_name} />
      </Box>
    </BaseDetailSection>
  );
};
