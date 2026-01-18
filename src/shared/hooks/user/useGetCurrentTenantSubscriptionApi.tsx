import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type CurrentTenantSubscription } from '@shared/types/user/CurrentTenantSubscription';

import axiosClient from '@core/axiosClient'

export type GetCurrentTenantSubscriptionResponse = CurrentTenantSubscription

export const useGetCurrentTenantSubscriptionApi = <T = GetCurrentTenantSubscriptionResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getCurrentTenantSubscription = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/user/me/tenant-subscription`

    try {
      const response = await axiosClient.get<T>(
        url.replace(getBackendUrl(), ''),
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, getCurrentTenantSubscription };
}
