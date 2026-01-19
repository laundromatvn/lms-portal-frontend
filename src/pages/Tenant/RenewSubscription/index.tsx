import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import {
  SelectAndReviewSubscriptionPlanStep,
  ConfirmAndPayStep,
} from './Steps';

import { QUERY_KEYS } from './constants';

const STEPS = {
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

export const RenewSubscriptionPage: React.FC = () => {
  const { t } = useTranslation();
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
    <PortalLayoutV2
      title={t('subscription.renewSubscription')}
      onBack={() => navigate(-1)}
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
    </PortalLayoutV2>
  );
};
