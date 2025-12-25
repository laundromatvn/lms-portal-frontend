import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type SubscriptionPlan } from '@shared/types/SubscriptionPlan';

import axiosClient from '@core/axiosClient'

export type ListSubscriptionPlanRequest = {
  page?: number;
  page_size?: number;
  is_enabled?: boolean;
  is_default?: boolean;
  search?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

export type ListSubscriptionPlanResponse = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: SubscriptionPlan[];
}

export const useListSubscriptionPlanApi = <T = ListSubscriptionPlanResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listSubscriptionPlan = useCallback(async (queryParams: ListSubscriptionPlanRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/subscription-plan`

    try {
      const response = await axiosClient.get<T>(
        url.replace(getBackendUrl(), ''),
        { params: queryParams }
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, listSubscriptionPlan };
}
