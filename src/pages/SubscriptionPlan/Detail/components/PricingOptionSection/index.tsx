import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Table,
  Tag,
  Flex,
  Typography,
  Button,
  Dropdown,
} from 'antd';

import {
  MenuDots,
  PenNewSquare,
  TrashBinTrash,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';
import type { SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';
import { type SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';
import { DynamicTag } from '@shared/components/DynamicTag';

import { formatCurrencyCompact } from '@shared/utils/currency';


interface Props {
  subscriptionPlan: SubscriptionPlan | null;
  loading?: boolean;
}

export const PricingOptionsSection: React.FC<Props> = ({ subscriptionPlan, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const columns = [
    {
      title: t('subscription.baseUnitPrice'),
      dataIndex: 'base_unit_price',
      key: 'base_unit_price',
      width: 128,
      render: (_: any, record: SubscriptionPricingOption) => {
        return (
          <Flex vertical style={{ whiteSpace: 'nowrap' }}>
            <Typography.Text strong>{formatCurrencyCompact(record.base_unit_price)}</Typography.Text>
            <Typography.Text type='secondary'> /{record.interval_count} {t(`subscription.billingIntervals.${record.billing_interval}`)}</Typography.Text>
          </Flex>
        )
      }
    },
    {
      title: t('subscription.pricingUnit'),
      dataIndex: 'pricing_unit',
      key: 'pricing_unit',
      width: 128,
      render: (_: any, record: SubscriptionPricingOption) => {
        return (
          <Typography.Text type='secondary' style={{ whiteSpace: 'nowrap' }}>
            {t(`subscription.pricingUnits.${record.pricing_unit}`)}
          </Typography.Text>
        );
      }
    },
    {
      title: t('subscription.billingType'),
      dataIndex: 'billing_type',
      key: 'billing_type',
      width: 128,
      render: (_: any, record: SubscriptionPricingOption) => {
        const color = record.billing_type === SubscriptionPricingBillingTypEnum.RECURRING ? 'blue' : 'green';

        return record.billing_type === SubscriptionPricingBillingTypEnum.RECURRING ? (
          <Tag color={color} style={{ whiteSpace: 'nowrap' }}>{t(`subscription.billingTypes.${record.billing_type}`)}</Tag>
        ) : (
          <Typography.Text type='secondary' style={{ whiteSpace: 'nowrap' }}>-</Typography.Text>
        );
      }
    },
    {
      title: t('subscription.trialPeriodDays'),
      dataIndex: 'trial_period_days',
      key: 'trial_period_days',
      width: 128,
      render: (_: any, record: SubscriptionPricingOption) => {
        return (
          <Typography.Text type='secondary' style={{ whiteSpace: 'nowrap' }}>
            {record.trial_period_days ? (
              `${record.trial_period_days} ${t('subscription.days')}`
            ) : (
              '-'
            )}
          </Typography.Text>
        );
      }
    },
    {
      title: t('subscription.isDefaultPricingOption'),
      dataIndex: 'is_default',
      key: 'is_default',
      width: 128,
      render: (_: any, record: SubscriptionPricingOption) => {
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <DynamicTag value={record.is_default ? 'enabled' : 'disabled'} />
          </div>
        );
      }
    },
    {
      title: t('subscription.isEnabledPricingOption'),
      dataIndex: 'is_enabled',
      key: 'is_enabled',
      width: 128,
      render: (_: any, record: SubscriptionPricingOption) => {
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <DynamicTag value={record.is_enabled ? 'enabled' : 'disabled'} />
          </div>
        );
      }
    },
    {
      title: t('common.actions'),
      dataIndex: 'actions',
      key: 'actions',
      width: 128,
      render: (_: any, record: SubscriptionPricingOption) => {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: t('common.edit'),
                  icon: <PenNewSquare />,
                },
                {
                  key: 'delete',
                  label: t('common.delete'),
                  icon: <TrashBinTrash />,
                  style: { color: theme.custom.colors.danger.default },
                },
              ],
            }}
          >
            <Button type="text" icon={<MenuDots weight="Bold" />} />
          </Dropdown>
        );
      }
    },
  ];

  return (
    <BaseDetailSection
      title={t('subscription.pricingConfiguration')}
      loading={loading}
    >
      <Table
        dataSource={subscriptionPlan?.pricing_options || []}
        loading={loading}
        columns={columns}
        pagination={false}
        style={{
          width: '100%',
          backgroundColor: theme.custom.colors.background.light,
          overflowX: 'auto',
        }}
        onRow={() => {
          return {
            style: {
              backgroundColor: theme.custom.colors.background.light,
            },
          };
        }}
      />
    </BaseDetailSection>
  );
};
