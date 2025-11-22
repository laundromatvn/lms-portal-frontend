import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'

export type GetPortalPermissionAccessAppResponse = {
  portal_laundry_foundation_management: boolean;
  portal_system_management: boolean;
}

export const useGetPortalPermissionAccessAppApi = <T = GetPortalPermissionAccessAppResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getPortalPermissionAccessApp = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/portal/access`

    try {
      const response = await axiosClient.get<GetPortalPermissionAccessAppResponse>(
        url.replace(getBackendUrl(), ''),
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as GetPortalPermissionAccessAppResponse
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, getPortalPermissionAccessApp };
}
