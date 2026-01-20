import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Flex,
  QRCode,
  Typography,
} from 'antd';
import { useTheme } from '@shared/theme/useTheme';

import {
  useGetInternalPaymentInformationApi,
  type GetInternalPaymentInformationResponse,
} from '@shared/hooks/useGetInternalPaymentInformationApi';

import type { PreviewSubscriptionInvoiceResponse } from '@shared/hooks/subscription/usePreviewSubscriptionInvoiceApi';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { Box } from '@shared/components/Box';
import { DataWrapper } from '@shared/components/DataWrapper';
import { SubscriptionInvoiceProcessingModal } from './SubscriptionInvoiceProcessingModal';

import { formatCurrencyCompact } from '@shared/utils/currency';

interface Props {
  previewSubscriptionInvoiceResult: PreviewSubscriptionInvoiceResponse | null;
  onPaidSuccess: () => void;
  loading: boolean;
}

export const PaymentInformationSection: React.FC<Props> = ({ previewSubscriptionInvoiceResult, onPaidSuccess, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);

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

        {previewSubscriptionInvoiceResult && (
          <Box
            vertical
            gap={theme.custom.spacing.medium}
            style={{
              width: '100%',
              border: `1px solid ${theme.custom.colors.neutral[200]}`,
              borderRadius: theme.custom.radius.large,
              padding: theme.custom.spacing.medium,
            }}
          >
            <DataWrapper title={t('subscription.finalAmount')}>
              <Typography.Text strong style={{ color: theme.custom.colors.success[700] }}>
                {formatCurrencyCompact(previewSubscriptionInvoiceResult.final_amount)}
              </Typography.Text>
            </DataWrapper>
          </Box>
        )}

        <Button
          type="primary"
          size="large"
          onClick={() => setIsModalOpen(true)}
          loading={loading}
          style={{
            width: '100%',
            backgroundColor: theme.custom.colors.success[700],
            padding: theme.custom.spacing.large,
            fontWeight: 'bold',
            border: `1px solid ${theme.custom.colors.success[700]}`,
          }}
        >
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

      <SubscriptionInvoiceProcessingModal
        isModalOpen={isModalOpen}
        onPaidSuccess={onPaidSuccess}
      />
    </BaseDetailSection>
  );
};
