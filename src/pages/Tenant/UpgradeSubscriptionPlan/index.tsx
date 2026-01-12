import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { PortalLayoutV2 } from '@shared/components/layouts/PortalLayoutV2';

import {
  SelectSubscriptionPlanStep,
  ConfirmAndPayStep,
} from './Steps';

import { QUERY_KEYS } from './constants';

export const STEPS = {
  SELECT_SUBSCRIPTION_PLAN: 'select-subscription-plan',
  CONFIRM_AND_PAY: 'confirm-and-pay',
} as const;

export type SubscriptionUpgradeStep =
  typeof STEPS[keyof typeof STEPS];

const DEFAULT_STEP = STEPS.SELECT_SUBSCRIPTION_PLAN;

const isValidStep = (
  step: string | null
): step is SubscriptionUpgradeStep =>
  step !== null &&
  Object.values(STEPS).includes(step as SubscriptionUpgradeStep);

export const UpgradeSubscriptionPlanPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: tenantId } = useParams<{ id: string }>();

  const [searchParams, setSearchParams] = useSearchParams();

  const currentStep: SubscriptionUpgradeStep = (() => {
    const stepFromUrl = searchParams.get(QUERY_KEYS.STEP);
    return isValidStep(stepFromUrl) ? stepFromUrl : DEFAULT_STEP;
  })();

  const goToStep = (
    step: SubscriptionUpgradeStep,
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

  if (!tenantId) {
    return null;
  }

  return (
    <PortalLayoutV2
      title={t('subscription.upgradeSubscriptionPlan')}
      onBack={() => navigate(-1)}
    >
      {currentStep === STEPS.SELECT_SUBSCRIPTION_PLAN && (
        <SelectSubscriptionPlanStep
          tenantId={tenantId}
          onSelectPlan={(subscriptionPlanId: string, pricingOptionId: string) =>
            goToStep(STEPS.CONFIRM_AND_PAY, {
              [QUERY_KEYS.SUBSCRIPTION_PLAN_ID]: subscriptionPlanId,
              [QUERY_KEYS.PRICING_OPTION_ID]: pricingOptionId,
            })}
        />
      )}

      {currentStep === STEPS.CONFIRM_AND_PAY && (
        <ConfirmAndPayStep
          tenantId={tenantId}
          onBack={() => goToStep(STEPS.SELECT_SUBSCRIPTION_PLAN)}
        />
      )}
    </PortalLayoutV2>
  );
};
