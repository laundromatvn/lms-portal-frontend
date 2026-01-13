import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Table,
  Tag,
  Flex,
  Typography,
  Button,
  Dropdown,
  notification,
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import {
  MenuDots,
  PenNewSquare,
  TrashBinTrash,
} from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import {
  useUpdateSubscriptionPlanApi,
  type UpdateSubscriptionPlanResponse,
} from '@shared/hooks/subscription_plan/useUpdateSubscriptionPlanApi';

import { SubscriptionPricingBillingTypEnum } from '@shared/enums/SubscriptionPricingBillingTypEnum';
import type { SubscriptionPricingOption } from '@shared/types/subscription/SubscriptionPricingOption';
import { type SubscriptionPlan } from '@shared/types/subscription/SubscriptionPlan';

import { BaseDetailSection } from '@shared/components/BaseDetailSection';

import { OptionDrawer } from './OptionDrawer';

import { formatCurrencyCompact } from '@shared/utils/currency';


interface Props {
  subscriptionPlan: SubscriptionPlan | null;
  loading?: boolean;
  onRefresh?: () => void;
}

export const PricingOptionsSection: React.FC<Props> = ({ subscriptionPlan, loading, onRefresh }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [api, contextHolder] = notification.useNotification();

  const [selectedPricingOption, setSelectedPricingOption] = useState<SubscriptionPricingOption | undefined>(undefined);
  const [openOptionDrawer, setOpenOptionDrawer] = useState(false);

  const {
    updateSubscriptionPlan,
    data: updateSubscriptionPlanData,
    error: updateSubscriptionPlanError,
  } = useUpdateSubscriptionPlanApi<UpdateSubscriptionPlanResponse>();

  const columns = [
    {
      title: t('subscription.baseUnitPrice'),
      dataIndex: 'base_unit_price',
      key: 'base_unit_price',
      width: 128,
      render: (_: any, record: SubscriptionPricingOption) => {
        return (
          <Flex vertical gap={theme.custom.spacing.small} style={{ whiteSpace: 'nowrap' }}>
            {record.billing_type === SubscriptionPricingBillingTypEnum.RECURRING ? (
              <Typography.Text strong>
                {formatCurrencyCompact(record.base_unit_price)}
                <Typography.Text type='secondary'> /{record.interval_count} {t(`subscription.billingIntervals.${record.billing_interval}`)}</Typography.Text>
              </Typography.Text>
            ) : (
              <Typography.Text strong>{formatCurrencyCompact(record.base_unit_price)}</Typography.Text>
            )}
            <Flex gap={theme.custom.spacing.xsmall}>
              {record.is_default && <Tag color="blue">{t('subscription.default')}</Tag>}
              {record.is_enabled ? <Tag color="green">{t('subscription.enabled')}</Tag> : <Tag>{t('subscription.disabled')}</Tag>}
            </Flex>
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
          <Typography.Text style={{ whiteSpace: 'nowrap' }}>
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

        return (
          <Tag color={color} style={{ whiteSpace: 'nowrap' }}>{t(`subscription.billingTypes.${record.billing_type}`)}</Tag>
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
          <Typography.Text style={{ whiteSpace: 'nowrap' }}>
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
                  onClick: () => {
                    setSelectedPricingOption(record);
                    setOpenOptionDrawer(true);
                  }
                },
                {
                  key: 'delete',
                  label: t('common.delete'),
                  icon: <TrashBinTrash />,
                  style: { color: theme.custom.colors.danger.default },
                  onClick: () => {
                    handleDeletePricingOption(record.id as string);
                  }
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

  const handleEditPricingOption = (newPricingOption: SubscriptionPricingOption) => {
    setSelectedPricingOption(undefined);
    setOpenOptionDrawer(false);

    if (!newPricingOption.id) {
      handleAddPricingOption(newPricingOption);
      return;
    }

    // if newPricingOption is set default, set all other options to not default
    updateSubscriptionPlan(subscriptionPlan?.id || '', {
      pricing_options: (subscriptionPlan?.pricing_options || []).map((option) => {
        if (option.id === newPricingOption.id) {
          return newPricingOption;
        }

        if (newPricingOption.is_default) {
          return { ...option, is_default: false };
        }

        return option;
      }),
    });
  };

  const handleAddPricingOption = (newPricingOption: SubscriptionPricingOption) => {
    const isExistingOption = subscriptionPlan?.pricing_options?.some((option) => (
      option.pricing_unit === newPricingOption.pricing_unit
      && option.billing_type === newPricingOption.billing_type
      && option.billing_interval === newPricingOption.billing_interval
    ));

    if (isExistingOption) {
      api.error({
        message: t('subscription.messages.pricingOptionAlreadyExists'),
      });
      return;
    }

    // if newPricingOption is set default, set all other options to not default
    const newPricingOptions = [...(subscriptionPlan?.pricing_options || []), newPricingOption];

    if (newPricingOption.is_default) {
      newPricingOptions.forEach((option) => {
        if (option.id !== newPricingOption.id) {
          option.is_default = false;
        }
      });
    }

    updateSubscriptionPlan(subscriptionPlan?.id || '', {
      pricing_options: newPricingOptions,
    });
  };

  const handleDeletePricingOption = (id: string) => {
    updateSubscriptionPlan(subscriptionPlan?.id || '', {
      pricing_options: (subscriptionPlan?.pricing_options || []).filter((option) => option.id !== id),
    });
  };

  useEffect(() => {
    if (updateSubscriptionPlanData) {
      api.success({
        message: t('subscription.messages.updateSubscriptionPlanSuccess'),
      });
      onRefresh?.();
    }
  }, [updateSubscriptionPlanData]);

  useEffect(() => {
    if (updateSubscriptionPlanError) {
      api.error({
        message: t('subscription.messages.updateSubscriptionPlanError'),
      });
    }
  }, [updateSubscriptionPlanError]);

  return (
    <BaseDetailSection
      title={t('subscription.pricingConfiguration')}
      loading={loading}
      onRefresh={onRefresh}
    >
      {contextHolder}

      <Flex justify="end" gap={theme.custom.spacing.medium} style={{ width: '100%' }}>
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedPricingOption(undefined);
            setOpenOptionDrawer(true);
          }}
          style={{
            backgroundColor: theme.custom.colors.background.light,
            color: theme.custom.colors.neutral.default,
          }}
        >
          {t('subscription.addPricingOption')}
        </Button>
      </Flex>

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

      <OptionDrawer
        pricingOption={selectedPricingOption}
        open={openOptionDrawer}
        onClose={() => setOpenOptionDrawer(false)}
        onSave={handleEditPricingOption}
      />
    </BaseDetailSection>
  );
};
