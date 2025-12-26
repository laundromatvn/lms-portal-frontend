import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

import axiosClient from '@core/axiosClient'

export type SetDefaultSubscriptionPlanResponse = boolean;

export const useSetDefaultSubscriptionPlanApi = <T = SetDefaultSubscriptionPlanResponse>() => {
  const [state, setState] = useState<ApiState<SetDefaultSubscriptionPlanResponse>>({
    data: false as SetDefaultSubscriptionPlanResponse,
    loading: false,
    error: null,
  });

  const setDefaultSubscriptionPlan = useCallback(async (subscription_plan_id: string) => {
    setState({ data: false as SetDefaultSubscriptionPlanResponse, loading: true, error: null });

    const url = `${getBackendUrl()}/api/v1/subscription-plan/set-default`

    const payload = {
      subscription_plan_id: subscription_plan_id,
    }

    try {
      await axiosClient.post<SetDefaultSubscriptionPlanResponse>(
        url.replace(getBackendUrl(), ''),
        payload
      )

      setState({ data: true as SetDefaultSubscriptionPlanResponse, loading: false, error: null });
      return true as SetDefaultSubscriptionPlanResponse
    } catch (error: any) {
      setState({ data: false as SetDefaultSubscriptionPlanResponse, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, []);

  return { ...state, setDefaultSubscriptionPlan };
}
