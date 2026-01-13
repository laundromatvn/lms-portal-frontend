import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Drawer, Flex, Typography } from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import type { SubscriptionInvoice } from '@shared/types/subscription/SubscriptionInvoice';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DataWrapper } from '@shared/components/DataWrapper';

import { formatDateTime } from '@shared/utils/date';
import { formatCurrencyCompact } from '@shared/utils/currency';
import { DynamicTag } from '@shared/components/DynamicTag';

interface Props {
  open: boolean;
  onClose: () => void;
  invoice: SubscriptionInvoice;
  onConfirmPayment: () => void;
  onRejectPayment: () => void;
}

export const InvoiceDetailDrawer: React.FC<Props> = ({ open, onClose, invoice, onConfirmPayment, onRejectPayment }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t('subscription.invoice')}
      width={600}
      footer={
        <Flex justify="space-between" gap={theme.custom.spacing.medium}>
          <Button danger size="large" onClick={onClose} style={{ width: '100%' }}>
            {t('subscription.rejectPayment')}
          </Button>
          <Button size="large" type="primary" onClick={onConfirmPayment} style={{ width: '100%' }}>
            {t('subscription.confirmPayment')}
          </Button>
        </Flex>
      }
    >
      <Flex vertical gap={theme.custom.spacing.medium}>
        <BaseDetailSection title={t('subscription.invoice')}>
          <DataWrapper title={t('subscription.invoiceCode')} value={invoice.code} />
          <DataWrapper title={t('subscription.tenantName')}>
            <Typography.Link onClick={() => navigate(`/tenants/${invoice.tenant_id}/detail`)}>
              {invoice.tenant_name}
            </Typography.Link>
          </DataWrapper>
          <DataWrapper title={t('common.status')}>
            <DynamicTag value={invoice.status} type="text" />
          </DataWrapper>
          <DataWrapper title={t('subscription.invoicePeriodStartDate')} value={formatDateTime(invoice.invoice_period_start_date)} />
          <DataWrapper title={t('subscription.invoicePeriodEndDate')} value={invoice.invoice_period_end_date ? formatDateTime(invoice.invoice_period_end_date) : t('common.unknown')} />
        </BaseDetailSection>

        <BaseDetailSection title={t('subscription.paymentInformation')}>
          <DataWrapper title={t('subscription.subscriptionPlanName')}>
            <Typography.Text strong>{invoice.subscription_plan_name}</Typography.Text>
          </DataWrapper>
          <DataWrapper title={t('subscription.billingType')} value={t(`subscription.billingTypes.${invoice.billing_type}`)} />
          <DataWrapper title={t('subscription.pricingUnit')} value={t(`subscription.pricingUnits.${invoice.pricing_unit}`)} />
          <DataWrapper title={t('subscription.billingInterval')} value={t(`subscription.billingIntervals.${invoice.billing_interval}`)} />
          <DataWrapper title={t('subscription.intervalCount')} value={invoice.interval_count} />
          <DataWrapper title={t('subscription.baseUnitPrice')}>
            <Typography.Text strong>{formatCurrencyCompact(invoice.base_unit_price)}</Typography.Text>
          </DataWrapper>
          <DataWrapper title={t('subscription.trialPeriodDays')} value={invoice.trial_period_days ? `${invoice.trial_period_days} ${t('subscription.days')}` : t('common.unknown')} />
          <DataWrapper title={t('subscription.billingUnitCount')} value={invoice.billing_unit_count} />
          <DataWrapper title={t('subscription.baseAmount')} value={formatCurrencyCompact(invoice.base_amount)} />
          <DataWrapper title={t('subscription.discountAmount')} value={formatCurrencyCompact(invoice.discount_amount)} />
          <DataWrapper title={t('subscription.finalAmount')}>
            <Typography.Text strong>{formatCurrencyCompact(invoice.final_amount)}</Typography.Text>
          </DataWrapper>
        </BaseDetailSection>
      </Flex>
    </Drawer>
  );
};
