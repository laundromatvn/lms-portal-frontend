import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import axiosClient from '@core/axiosClient'

import { type ApiState } from '@shared/hooks/types'

import { SubscriptionPlanTypeEnum } from '@shared/enums/SubscriptionPlanTypeEnum';
import { SubscriptionPlanIntervalEnum } from '@shared/enums/SubscriptionPlanIntervalEnum';

export type UpdateSubscriptionPlanPayload = {
  name?: string;
  description?: string;
  is_enabled? : boolean;
  price?: number;
  type?: SubscriptionPlanTypeEnum;
  interval?: SubscriptionPlanIntervalEnum;
  interval_count?: number;
  trial_period_count?: number;
  permission_group_id?: string;
}

export type UpdateSubscriptionPlanResponse = boolean;

export const useUpdateSubscriptionPlanApi = <T = UpdateSubscriptionPlanResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const updateSubscriptionPlan = useCallback(async (subscription_plan_id: string, payload: UpdateSubscriptionPlanPayload) => {
    setState({ data: false as T, loading: true, error: null });

    const url = `${getBackendUrl()}/api/v1/subscription-plan/${subscription_plan_id}`

    try {
      await axiosClient.patch<T>(url.replace(getBackendUrl(), ''), payload)

      setState({ data: true as T, loading: false, error: null });
      return true as T;
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, []);

  return { ...state, updateSubscriptionPlan };
}
