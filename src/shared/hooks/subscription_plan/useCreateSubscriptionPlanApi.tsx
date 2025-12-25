import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { SubscriptionPlanTypeEnum } from '@shared/enums/SubscriptionPlanTypeEnum';
import { SubscriptionPlanIntervalEnum } from '@shared/enums/SubscriptionPlanIntervalEnum';

import axiosClient from '@core/axiosClient'

export type CreateSubscriptionPlanPayload = {
  name: string;
  description: string | null;
  is_enabled: boolean | null;
  is_default: boolean | null;
  price: number;
  type: SubscriptionPlanTypeEnum;
  interval: SubscriptionPlanIntervalEnum | null;
  interval_count: number | null;
  trial_period_count: number | null;
  permission_group_id: string;
}

export type CreateSubscriptionPlanResponse = boolean;

export const useCreateSubscriptionPlanApi = <T = CreateSubscriptionPlanResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const createSubscriptionPlan = useCallback(async (payload: CreateSubscriptionPlanPayload) => {
    setState({ data: false as T, loading: true, error: null });

    const url = `${getBackendUrl()}/api/v1/subscription-plan`

    try {
      await axiosClient.post<T>(
        url.replace(getBackendUrl(), ''),
        payload
      )

      setState({ data: true as T, loading: false, error: null });
      return true as T
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, []);

  return { ...state, createSubscriptionPlan };
}
