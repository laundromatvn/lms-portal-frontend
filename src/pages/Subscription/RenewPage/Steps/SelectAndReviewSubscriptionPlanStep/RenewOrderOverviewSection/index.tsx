import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';

import {
  usePreviewSubscriptionInvoiceApi,
  type PreviewSubscriptionInvoiceResponse,
} from '@shared/hooks/subscription/usePreviewSubscriptionInvoiceApi';

import type { SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';

import formatCurrencyCompact from '@shared/utils/currency';

interface Props {
  subscriptionPlanId: string;
  tenantId: string;
  selectedPricingOption: SubscriptionPricingOption | null;
}

export const RenewOrderOverviewSection: React.FC<Props> = ({
  subscriptionPlanId,
  tenantId,
  selectedPricingOption,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    previewSubscriptionInvoice,
    loading: previewSubscriptionInvoiceLoading,
    data: previewSubscriptionInvoiceData,
  } = usePreviewSubscriptionInvoiceApi<PreviewSubscriptionInvoiceResponse>();

  const handlePreviewSubscriptionInvoice = async () => {
    if (!selectedPricingOption?.id || !subscriptionPlanId || !tenantId) return;

    previewSubscriptionInvoice({
      tenant_id: tenantId,
      subscription_plan_id: subscriptionPlanId,
      pricing_option_id: selectedPricingOption.id,
    });
  };

  useEffect(() => {
    handlePreviewSubscriptionInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPricingOption, subscriptionPlanId, tenantId]);

  if (!selectedPricingOption) return null;

  return (
    <BaseDetailSection
      title={t('subscription.paymentInformation')}
      loading={previewSubscriptionInvoiceLoading}
    >
      <DataWrapper title={t('subscription.pricePerUnit')}>
        <Typography.Text strong>
          {formatCurrencyCompact(selectedPricingOption?.base_unit_price)}
          {selectedPricingOption.billing_type === SubscriptionPricingBillingTypEnum.RECURRING && (
            <Typography.Text type='secondary'>
              {' '}/ {selectedPricingOption.interval_count} {t(`subscription.billingIntervals.${selectedPricingOption?.billing_interval}`)}
            </Typography.Text>
          )}
          <Typography.Text type='secondary'>
            {' '}/{t(`subscription.pricingUnits.${selectedPricingOption?.pricing_unit}`)}
          </Typography.Text>
        </Typography.Text>
      </DataWrapper>

      {previewSubscriptionInvoiceData && (
        <>
          <DataWrapper
            title={t('subscription.billingUnitCount')}
            value={previewSubscriptionInvoiceData.unit_count}
          />
          <DataWrapper
            title={t('subscription.baseAmount')}
            value={formatCurrencyCompact(previewSubscriptionInvoiceData.base_amount)}
          />
          <DataWrapper
            title={t('subscription.discountAmount')}
            value={formatCurrencyCompact(previewSubscriptionInvoiceData.discount_amount)}
          />
          <DataWrapper title={t('subscription.finalAmount')}>
            <Typography.Text strong style={{ color: theme.custom.colors.success[700] }}>
              {formatCurrencyCompact(previewSubscriptionInvoiceData.final_amount)}
            </Typography.Text>
          </DataWrapper>
        </>
      )}
    </BaseDetailSection >
  );
};
