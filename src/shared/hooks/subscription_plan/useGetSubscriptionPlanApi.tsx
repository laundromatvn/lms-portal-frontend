import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';

import axiosClient from '@core/axiosClient'

export type GetSubscriptionPlanResponse = SubscriptionPlan;

export const useGetSubscriptionPlanApi = <T = GetSubscriptionPlanResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getSubscriptionPlan = useCallback(async (subscription_plan_id: string) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/subscription-plan/${subscription_plan_id}`

    try {
      const response = await axiosClient.get<T>(url.replace(getBackendUrl(), ''))

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, getSubscriptionPlan };
}
