import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'

export type GetPortalAccessAppResponse = {
  portal_laundry_foundation_management: boolean;
  portal_system_management: boolean;
}

export const useGetPortalAccessAppApi = <T = GetPortalAccessAppResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getPortalAccessApp = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/portal/access`

    try {
      const response = await axiosClient.get<GetPortalAccessAppResponse>(
        url.replace(getBackendUrl(), ''),
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as GetPortalAccessAppResponse
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, getPortalAccessApp };
}
