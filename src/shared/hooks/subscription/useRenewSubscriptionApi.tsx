import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

import axiosClient from '@core/axiosClient'

export type RenewSubscriptionResponse = boolean;

export const useRenewSubscriptionApi = <T = RenewSubscriptionResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const renewSubscription = useCallback(async (subscription_id: string, pricing_option_id: string) => {
    setState({ data: false as T, loading: true, error: null });

    const url = `${getBackendUrl()}/api/v1/subscription/${subscription_id}/renew`

    try {
      await axiosClient.post(
        url.replace(getBackendUrl(), ''),
        { pricing_option_id }
      )

      setState({ data: true as T, loading: false, error: null });
      return true as T
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, []);

  return { ...state, renewSubscription };
}
