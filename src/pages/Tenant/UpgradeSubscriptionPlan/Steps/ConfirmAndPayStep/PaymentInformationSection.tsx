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

interface Props {
  onPaid: () => void;
  loading: boolean;
}

export const PaymentInformationSection: React.FC<Props> = ({ onPaid, loading }) => {
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

  return (
    <BaseDetailSection loading={loading || internalPaymentInformationLoading}>
      <Flex
        vertical
        align="center"
        gap={theme.custom.spacing.medium}
        style={{ width: '100%' }}
      >
        <QRCode
          size={256}
          value={internalPaymentInformation?.bank_account_qr_code || ''}
        />

        <Typography.Text type="secondary">
          {t('subscription.pleaseConfirmAfterTransferredSuccess')}
        </Typography.Text>

        <Button type="primary" size="large" style={{ width: '100%' }} onClick={onPaid}>
          {t('subscription.confirmTransferredSuccess')}
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
        <DataWrapper title={t('common.bankName')} compactWidth={156} value={`(${internalPaymentInformation?.bank_code}) ${internalPaymentInformation?.bank_name}`} />
        <DataWrapper title={t('common.bankAccountNumber')} compactWidth={156} value={internalPaymentInformation?.bank_account} />
        <DataWrapper title={t('common.bankAccountName')} compactWidth={156} value={internalPaymentInformation?.bank_account_name} />
      </Box>
    </BaseDetailSection>
  );
};
