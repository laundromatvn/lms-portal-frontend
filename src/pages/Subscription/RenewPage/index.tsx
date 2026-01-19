import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button, Typography, Flex } from 'antd';
import { ArrowLeft } from '@solar-icons/react';

import { useTheme } from '@shared/theme/useTheme';

import { CenteredLayout } from '@shared/components/layouts/CenteredLayout';
import { Logo } from '@shared/components/common/Logo';
import { Box } from '@shared/components/Box';

import {
  SelectAndReviewSubscriptionPlanStep,
  ConfirmAndPayStep,
} from './Steps';

import { QUERY_KEYS } from './constants';

export const STEPS = {
  SELECT_AND_REVIEW_SUBSCRIPTION_PLAN: 'select-and-review-subscription-plan',
  CONFIRM_AND_PAY: 'confirm-and-pay',
} as const;

export type SubscriptionRenewalStep =
  typeof STEPS[keyof typeof STEPS];

const DEFAULT_STEP = STEPS.SELECT_AND_REVIEW_SUBSCRIPTION_PLAN;

const isValidStep = (
  step: string | null
): step is SubscriptionRenewalStep =>
  step !== null &&
  Object.values(STEPS).includes(step as SubscriptionRenewalStep);

export const RenewPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const currentStep: SubscriptionRenewalStep = (() => {
    const stepFromUrl = searchParams.get(QUERY_KEYS.STEP);
    return isValidStep(stepFromUrl) ? stepFromUrl : DEFAULT_STEP;
  })();

  const goToStep = (
    step: SubscriptionRenewalStep,
    extraParams?: Record<string, string>
  ) => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set(QUERY_KEYS.STEP, step);

    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        nextParams.set(key, value);
      });
    }

    setSearchParams(nextParams, { replace: true });
  };

  return (
    <CenteredLayout
      layoutStyle={{ backgroundColor: theme.custom.colors.background.surface }}
      style={{ height: '100vh' }}
    >
      <Flex
        vertical
        gap={theme.custom.spacing.medium}
        style={{
          width: '100%',
          height: '100vh',
        }}
      >
        <Typography.Title level={2} style={{ textAlign: 'center', marginTop: theme.custom.spacing.large }}>
          {t('subscription.renewSubscription')}
        </Typography.Title>

        <Box
          vertical
          gap={theme.custom.spacing.medium}
          style={{
            width: '100%',
            backgroundColor: theme.custom.colors.background.surface,
          }}
        >
          {currentStep === STEPS.SELECT_AND_REVIEW_SUBSCRIPTION_PLAN && (
            <SelectAndReviewSubscriptionPlanStep
              onSelectPlan={(subscriptionPlanId: string, pricingOptionId: string) =>
                goToStep(STEPS.CONFIRM_AND_PAY, {
                  [QUERY_KEYS.SUBSCRIPTION_PLAN_ID]: subscriptionPlanId,
                  [QUERY_KEYS.PRICING_OPTION_ID]: pricingOptionId,
                })}
            />
          )}

          {currentStep === STEPS.CONFIRM_AND_PAY && (
            <ConfirmAndPayStep
              onBack={() => goToStep(STEPS.SELECT_AND_REVIEW_SUBSCRIPTION_PLAN)}
            />
          )}
        </Box>
      </Flex>
    </CenteredLayout>
  );
};
